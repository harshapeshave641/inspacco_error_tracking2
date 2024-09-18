import React, { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { compact, lowerCase, range, startCase } from "lodash";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Datepicker from "react-tailwindcss-datepicker";
import _ from "lodash";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import TasksIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import {
  _getStatusType,
  convertDate,
  gropupByServiceSubscription,
  mapTaskToTaskIds,
  pickupDataFromResponse,
  populateNestedRecords,
} from "../../helpers/utils";
import { GET_TASKS_BY_SOCIETY } from "../../graphql/queries/getTasksBySociety";

import Input from "../../components/common/neomorphic/Input";
import Button from "../../components/common/neomorphic/Button";
import Toggle from "../../components/common/Toggle";

import { GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY } from "../../graphql/queries/getActiveServiceSubscriptionsBySociety";
import {
  CREATE_TASK_USING_CLOUD_CODE,
  UPDATE_TASK,
} from "../../graphql/mutations/task/createTaskUsingCloudCode";
import { GET_SERVICE_REQUEST_COMMENTS } from "../../graphql/queries/getServiceRequestComments";

import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
import Drilldown from "../../components/common/Cards/Drilldown";
import Modal from "../../components/common/Modal";
import Select from "../../components/common/neomorphic/Select";
import {
  GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY,
  GET_TASK_BY_SOCIETY,
} from "../../graphql/queries/getTasks";
import { GET_PARTNER_MEMBERS_BY_TYPE_QUERY } from "../../graphql/queries/getPartnerMembers";
import {
  UPDATE_TASK_ACTIVITY_ATTACHMENT_BY_ID,
  UPDATE_TASK_ACTIVITY_BY_ID,
} from "../../graphql/mutations/task/updateTaskActivity";
import { ACTIONS } from "../../helpers/validations";
import { DELETE_TASK } from "../../graphql/mutations/task/removeTaskFromServiceSubscription";
import ActivityHistory from "../../components/common/ActivityHistory";
import ConfirmationBox from "../../components/common/Dialog/ConfirmationBox";

const Tasks = () => {
  let [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  let [selectedTask, setselectedTask] = useState({});
  let [showCreateForm, setShowCreateForm] = useState(false);
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);

  const [showActivityHistoryModal, setShowActivityHistoryModal] =
    useState(false);

  let [activeSubs, setActiveSubs] = useState(null);

  let { activeAccountId, user } = useSelector((state) => state.authSlice);

  const initialForm = {
    serviceSubscriptionId: null, // !ID
    summary: null, //String!
    description: null, //String!
    rewardPoints: 0, //Float!
    frequency: null, // String!
    startDate: new Date(), //Date
    endDate: new Date(), //Date
    status: null, //String! = "Active"
    isVisible: false,
    dayInWeek: null,
    dayInMonth: null,
    category: null,
  };
  const [updateTaskActivity] = useMutation(UPDATE_TASK_ACTIVITY_BY_ID);
  const [removeTask] = useMutation(DELETE_TASK);
  const [updateTaskActivityAttachment] = useMutation(
    UPDATE_TASK_ACTIVITY_ATTACHMENT_BY_ID
  );
  let [createTaskformData, setCreateTaskFormData] = useState(initialForm);

  const [fetchTasksByServiceSubs, { data: tasksData }] = useLazyQuery(
    GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY,
    {
      variables: {
        societyId: activeAccountId,
      },
      onCompleted: async (data) => {
        await getServiceTasksBySociety({
          variables: {
            taskIds,
            startDate: moment(dateRange.startDate).startOf("day").toDate(),
            endDate: moment(dateRange.endDate).endOf("day").toDate(),
          },
        });
      },
      fetchPolicy: "network-only",
    }
  );

  const taskIds = mapTaskToTaskIds(tasksData);
  const tasksWithSubscription = gropupByServiceSubscription(tasksData);

  const {
    data: serviceTasks,
    loading: tasksLoading,
    refetch: getServiceTasksBySociety,
  } = useQuery(GET_TASK_BY_SOCIETY, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true, // refetch doesn't show loading if this option is not passed
    refetchWritePolicy: true,
    variables: {
      taskIds,
      startDate: moment(dateRange.startDate).startOf("day").toDate(),
      endDate: moment(dateRange.endDate).endOf("day").toDate(),
    },
    skip: taskIds === null,
  });

  const taskActivities =
    serviceTasks?.taskActivities?.edges.map((obj) => {
      const taskId = obj?.node?.task?.objectId;
      const taskWith = tasksWithSubscription.find(
        (obj) => obj.objectId === taskId
      );
      return {
        node: {
          ...obj.node,
          serviceSubscription: taskWith?.serviceSubscription,
        },
      };
    }) || [];

  const [createNewTask] = useMutation(CREATE_TASK_USING_CLOUD_CODE);
  const [updateTask] = useMutation(UPDATE_TASK);

  const [getServiceRequestComments, { data: serviceRequestComments }] =
    useLazyQuery(GET_SERVICE_REQUEST_COMMENTS, {
      variables: {
        serviceRequestId: selectedTask?.id,
      },
    });

  const [getActiveServiceSubs] = useLazyQuery(
    GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY,
    {
      onCompleted: (data) => setActiveSubs(data),
      skip: !activeAccountId,
    }
  );

  useEffect(() => {
    getActiveServiceSubs({
      variables: {
        societyId: activeAccountId,
        today: moment().toDate(),
      },
    });
    fetchTasksByServiceSubs();
    setselectedTask({});
  }, [activeAccountId]);

  const clearCreateForm = () => setCreateTaskFormData(initialForm);

  const handleCreateNewTask = async () => {
    let {
      serviceSubscriptionId,
      summary,
      description,
      rewardPoints,
      frequency,
      dayInMonth,
      dayInWeek,
      assignedTo,
      category,
      parentTask,
    } = createTaskformData;

    if (!description) description = " ";
    let isValidated = true;

    if (!serviceSubscriptionId) {
      toast.error("Please Select Service");
      isValidated = false;
    }
    if (!summary || !summary?.trim()) {
      toast.error("Please Provide Summary of task");
      isValidated = false;
    }
    if (!frequency) {
      toast.error("Please Select Frequncy");
      isValidated = false;
    }
    if (!assignedTo) {
      toast.error("Please Select Assignee");
      isValidated = false;
    }

    if (!isValidated) return;

    const taskPayload = {
      parentTask,
      serviceSubscriptionId:
        typeof serviceSubscriptionId === "object"
          ? serviceSubscriptionId.value
          : serviceSubscriptionId,
      summary, //String!
      description, //String!
      category,
      module: "ServiceSubscription",
      parentId:
        typeof serviceSubscriptionId === "object"
          ? serviceSubscriptionId.value
          : serviceSubscriptionId,
      rewardPoints, //Float!
      frequency: frequency.value || selectedTask?.task?.frequency, // String!
      startDate:
        (frequency?.value || frequency) === "ONCE"
          ? createTaskformData.startDate
          : null, //Date
      endDate:
        (frequency?.value || frequency) === "ONCE"
          ? createTaskformData.endDate
          : null, //Date
      dayInMonth: dayInMonth?.value, // number
      assignedTo:
        typeof assignedTo === "object" ? assignedTo?.value : assignedTo,
      dayInWeek: dayInWeek?.value, // string
      // isVisible, // Boolean
    };
    console.log("taskPayload", taskPayload);
    if (createTaskformData.objectId) {
      //edit task
      await updateTask({
        variables: {
          taskId: createTaskformData?.objectId,
          ...taskPayload,
          rewardPoints: parseInt(createTaskformData.rewardPoints.toString()),
        },
      });
      toast.success("Task Updated successfully!");
      await getServiceTasksBySociety();
    } else {
      let resp = await createNewTask({
        variables: {
          params: taskPayload,
        },
      });
      let isTaskCreationFailed = resp.data?.callCloudCode?.errors?.length;
      if (!isTaskCreationFailed) toast.success("Task added successfully!");
      else toast.error("Task added successfully!");
      setTimeout(async () => {
        fetchTasksByServiceSubs();
      }, 1000);
    }
    clearCreateForm();
    setShowCreateForm(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    if (selectedTask?.id) getServiceRequestComments();
  }, [selectedTask?.id]);

  const filtertasks = (filter) => {
    console.log("filter", filter);
    if (_.isEmpty(filter)) {
      return taskActivities;
    }
    console.log("taskActivities", taskActivities);
    return populateNestedRecords(taskActivities, "task").filter(({ node }) => {
      // console.log("node", node);
      let allConditionsMatch = true;
      if (filter.text) {
        if (!node?.task?.summary?.toLowerCase().includes(filter.text)) {
          allConditionsMatch = false;
        }
      }
      if (filter.status) {
        if (node?.taskStatus !== filter?.status?.value) {
          if (filter?.status?.value !== "ALL") {
            allConditionsMatch = false;
          }
        }
      }
      if (filter.service) {
        if (node.serviceSubscription?.objectId !== filter?.service?.value) {
          if (filter?.service?.value !== "all") {
            allConditionsMatch = false;
          }
        }
      }
      if (filter.category) {
        if (node.task?.category !== filter?.category?.value) {
          if (filter?.category?.value !== "all") {
            allConditionsMatch = false;
          }
        }
      }
      return allConditionsMatch;
    });
  };

  const toggleModal = () => setShowCreateForm(!showCreateForm);

  function handleRefresh() {
    fetchTasksByServiceSubs();
  }

  async function handleSubmit(data) {
    console.log("handleSubmit data", data);
    console.log("selectedTask", selectedTask);
    let payload = { id: selectedTask.objectId };
    let changeField = "";
    if (data.status !== selectedTask.taskStatus) {
      changeField = "Status";
      payload = {
        ...payload,
        taskStatus: data.status,
        action: ACTIONS.changeStatus,
        value: data.status,
        userId: user.objectId,
      };
    } else if (data.comment !== selectedTask.comment) {
      changeField = "Comment";
      payload = {
        ...payload,
        taskStatus: selectedTask.taskStatus,
        comment: data.comment,
        action: ACTIONS.editComment,
        value: data.comment,
        userId: user.objectId,
      };
    }
    //

    console.log("updatedValues", payload);
    await updateTaskActivity({ variables: payload });

    await getServiceTasksBySociety();

    toast.success(`Task  ${changeField} Updated successfully`);
  }

  async function handleAttachmentUpload(attachment) {
    if (!attachment) return;
    console.log("handleAttachmentUpload", attachment);
    const updatedValues = {
      id: selectedTask.objectId,
      attachments: Array.isArray(attachment) ? attachment : [attachment],
    };
    await updateTaskActivityAttachment({ variables: updatedValues });
    await getServiceTasksBySociety();
    toast.success(`Task Attachment Uploaded successfully`);
  }
  const activeServices = activeSubs?.serviceSubscriptions?.edges.map(
    ({ node }) => {
      return {
        value: node.objectId,
        label: node.service.name,
        partner: node.partner,
      };
    }
  );

  function populateFormDataForEdit() {
    const task = selectedTask?.task;
    const formData = {
      objectId: task?.objectId,
      serviceSubscriptionId: task?.parentId, // !ID
      summary: task?.summary, //String!
      description: task?.description, //String!
      rewardPoints: task?.rewardPoints, //Float!
      frequency: task?.frequency, // String!
      startDate: task?.startDate, //Date
      endDate: task?.endDate, //Date
      assignedTo: task?.assignedTo?.objectId,
      category: task?.category,
    };
    setCreateTaskFormData(formData);
  }

  async function handleRemoveTask() {
    try {
      const res = await removeTask({
        variables: {
          id: selectedTask?.task?.objectId,
        },
      });
      toast.success("Task Removed Successfully");
      await fetchTasksByServiceSubs();
      setselectedTask({});
    } catch (e) {
      toast.error(e?.message);
    }
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <DashboardTopBar
        singleDatePicker={true}
        dateRange={dateRange}
        onRefreshDataClicked={handleRefresh}
        updateDashboardPeriod={setDateRange}
        actions={
          <>
            <Button
              paddingClass="0"
              onClick={(e) => {
                toggleModal();
                setCreateTaskFormData(initialForm);
              }}
              className="gap-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create New Task
            </Button>
          </>
        }
      />

      <Drilldown
        {...{
          source: "task",
          itemIcon: <TasksIcon className="w-6 h-6 text-accent" />,
          leftSideLoading: tasksLoading,
          rightSideLoading: false,
          listData: populateNestedRecords(
            taskActivities?.sort(
              (task1, task2) =>
                new Date(task1?.task?.createdAt) -
                new Date(task2?.task?.createdAt)
            ),
            "task"
          ),
          listFilterFn: filtertasks,
          onItemSelect: (v) => {
            console.log("v=>", v);
            setselectedTask({ ...v, status: v.taskStatus });
          },
          handleSubmit: handleSubmit,
          onUploadDone: handleAttachmentUpload,
          activeServices,
          activeItemDetails: {
            ...selectedTask,
            comments: serviceRequestComments,
          },
        }}
      >
        <section className="ml-4 inline-flex gap-2 items-center">
          {" "}
          <Button
            disabled={!selectedTask?.id}
            className="btn-warning btn-sm"
            onClick={() => {
              // console.log("test", test);
              populateFormDataForEdit();
              setShowCreateForm(true);
            }}
          >
            <PencilIcon className="w-3 h-3" /> &nbsp;Edit{" "}
          </Button>
          <Button
            disabled={!selectedTask?.id}
            className="btn-error btn-sm"
            onClick={(e) => setConfirmationBoxOpen(true)}
          >
            <TrashIcon className="w-3 h-3" /> &nbsp;Delete
          </Button>
          {!selectedTask?.task?.parentTask?.objectId ? (
            <Button
              disabled={!selectedTask?.id}
              className="btn-success btn-sm"
              onClick={(e) => {
                toggleModal();
                setCreateTaskFormData({
                  ...initialForm,
                  parentTask: selectedTask?.task?.objectId,
                  serviceSubscriptionId: selectedTask?.task?.parentId,
                  frequency: selectedTask?.task?.frequency,
                });
              }}
            >
              <RectangleGroupIcon className="w-3 h-3" /> &nbsp;Create Sub Task
            </Button>
          ) : null}
          <Button
            disabled={!selectedTask?.id}
            className="btn-ghost btn-sm"
            onClick={(e) => setShowActivityHistoryModal(true)}
          >
            <ClockIcon className="w-3 h-3" /> &nbsp;History
          </Button>{" "}
        </section>
      </Drilldown>
      {showCreateForm ? (
        <Modal
          title={
            createTaskformData?.objectId
              ? "Update Task"
              : createTaskformData?.parentTask
              ? "Create Sub Task "
              : "Create New Task"
          }
          closeModal={toggleModal}
          showModal={showCreateForm}
          onSubmit={handleCreateNewTask}
        >
          <CreateNewTaskForm
            {...{
              data: createTaskformData,
              setData: setCreateTaskFormData,
              activeSubs,
            }}
          />
        </Modal>
      ) : null}
      <Modal
        title={"Task Activity History"}
        closeModal={(e) => setShowActivityHistoryModal(false)}
        showModal={showActivityHistoryModal}
        showBtns={false}
      >
        <ActivityHistory
          activities={selectedTask?.activityHistory?.edges?.map((a) => a.node)}
        />
      </Modal>
      <ConfirmationBox
        isOpen={confirmationBoxOpen}
        title={"Delete Task"}
        message={`Do you want to delete the task ?`}
        onConfirm={(e) => {
          setConfirmationBoxOpen(false);
          handleRemoveTask();
        }}
        onCancel={(e) => setConfirmationBoxOpen(false)}
      />
    </div>
  );
};

export default Tasks;

const CreateNewTaskForm = ({ data, setData, activeSubs }) => {
  console.log("data", data);
  const frequencyOptions = useMemo(
    () =>
      compact([true ? "ONCE" : null, "DAILY", "WEEKLY", "MONTHLY"]).map(
        (item) => ({
          value: item,
          label: startCase(lowerCase(item)),
        })
      ),
    []
  );

  const dayInWeekOptions = useMemo(
    () =>
      range(0, 7).map((item) => ({
        value: item,
        label: moment.weekdays(item),
      })),
    []
  );

  const dayInMonthOptions = useMemo(
    () =>
      range(1, 31).map((item) => ({
        value: item,
        label: item.toString(),
      })),
    []
  );

  const activeServices = activeSubs?.serviceSubscriptions?.edges.map(
    ({ node }) => {
      return {
        value: node.objectId,
        label: node.service.name,
        partner: node.partner,
      };
    }
  );

  const { partner } =
    activeServices?.find(
      (service) =>
        service.value ===
        (typeof data?.serviceSubscriptionId === "object"
          ? data?.serviceSubscriptionId?.value
          : data?.serviceSubscriptionId)
    ) || {};

  const {
    error: partnerMemberError,
    data: partnerMemberData,
    refetch: fetchPartnerMember,
  } = useQuery(GET_PARTNER_MEMBERS_BY_TYPE_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      partnerId: partner?.objectId,
      type: ["PARTNER_ADMIN", "PARTNER_KAM"],
    },
    skip: partner?.objectId === null,
  });

  const partnerMembers = pickupDataFromResponse({ data: partnerMemberData });

  const memberOptions =
    partnerMembers?.map((obj) => {
      return {
        label: `${obj?.member?.firstName} ${obj?.member?.lastName} (${obj.type
          ?.split("_")
          .join(" ")})`,
        value: obj?.member?.objectId,
      };
    }) || [];

  return (
    <div className="w-full flex  flex-col gap-y- overflow-y-auto mx-6 mt-4 items-center ">
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium pb-1 text-accent">
          Services <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Select
            disabled={!!data.objectId || data.parentTask}
            native={false}
            onChange={(value) =>
              setData({ ...data, serviceSubscriptionId: value })
            }
            value={
              typeof data.serviceSubscriptionId === "object"
                ? data.serviceSubscriptionId
                : activeServices.find(
                    (o) => o.value === data.serviceSubscriptionId
                  )
            }
            options={activeServices || []}
          />
        </div>
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium pb-1 text-accent">
          Summary <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={data.summary}
          onChange={({ target: { value } }) =>
            setData({ ...data, summary: value })
          }
          placeholder="Summary"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium pb-1 text-accent">
          Description
        </label>
        <textarea
          type="text"
          value={data.description}
          onChange={({ target: { value } }) =>
            setData({ ...data, description: value })
          }
          placeholder="Description"
          className="textarea textarea-bordered textarea-md w-full "
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium pb-1 text-accent">
          Reward Points
        </label>
        <Input
          type="text"
          value={data.rewardPoints}
          onChange={({ target: { value } }) =>
            setData({ ...data, rewardPoints: Number(value) })
          }
          placeholder="Reward Points"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium text-accent pb-1">
          Frequency <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Select
            disabled={!!data.objectId || data.parentTask}
            onChange={(value) => setData({ ...data, frequency: value })}
            native={false}
            menuPlacement="top"
            options={frequencyOptions}
            value={
              typeof data.frequency === "object"
                ? data.frequency
                : frequencyOptions.find((a) => a.value === data.frequency)
            }
          />
        </div>
      </div>
      {(data.frequency?.value === "ONCE" || data.frequency == "ONCE") && (
        <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
          <label className="label-text text-lg font-medium pb-1 text-accent">
            Timespan
          </label>
          <Datepicker
            value={{ startDate: data.startDate, endDate: data.endDate }}
            theme={"light"}
            popoverDirection="up"
            toggleClassName="invisible"
            // maxDate={new Date()}
            // minDate={moment().subtract(1, "days").toDate()}
            inputClassName="text-base-content input input-bordered w-72"
            onChange={({ startDate, endDate }) =>
              setData({
                ...data,
                startDate,
                endDate,
              })
            }
            showShortcuts={false}
            primaryColor={"white"}
          />
        </div>
      )}
      {data.frequency?.value === "WEEKLY" && (
        <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
          <label className="label-text text-lg font-medium pb-1 text-accent">
            Days in week
          </label>
          <Select
            native={false}
            options={dayInWeekOptions}
            onChange={(value) => setData({ ...data, dayInWeek: value })}
          />
        </div>
      )}
      {data.frequency?.value === "MONTHLY" && (
        <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
          <label className="label-text text-lg font-medium pb-1 text-accent">
            Date in month
          </label>
          <Select
            native={false}
            options={dayInMonthOptions}
            onChange={(value) => setData({ ...data, dayInMonth: value })}
          />
        </div>
      )}
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium pb-1 text-accent">
          Category
        </label>
        <Input
          type="text"
          value={data.category}
          onChange={({ target: { value } }) =>
            setData({ ...data, category: value })
          }
          placeholder="Category"
          className="input input-md input-bordered w-full h-12"
        />
      </div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <label className="label-text text-lg font-medium text-accent pb-1">
          Assigned To <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Select
            placement="top"
            onChange={(value) => setData({ ...data, assignedTo: value })}
            native={false}
            menuPlacement="top"
            options={memberOptions}
            value={
              typeof data.assignedTo === "object"
                ? data.assignedTo
                : memberOptions.find((o) => o.value === data.assignedTo)
            }
          />
        </div>
      </div>
    </div>
  );
};
