import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import _, { isEmpty } from "lodash";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";

import { _getStatusType, pickupDataFromResponse } from "../../helpers/utils";
// import { GET_INCIDENTS_BY_DATERANGE } from "../../graphql/queries/getIncidents";
// import { GET_SERVICE_REQUEST_COMMENTS } from "../../graphql/queries/getServiceRequestComments";

import ComplaintsIcon from "@heroicons/react/24/outline/ShieldExclamationIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import Input from "../../components/common/neomorphic/Input";
import Button from "../../components/common/neomorphic/Button";
import Drilldown from "../../components/common/Cards/Drilldown";
import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
import Select from "../../components/common/neomorphic/Select";
import HoverIcon from "../../components/common/HoverIcon";
import Modal from "../../components/common/Modal";
import AttachmentList from "../../components/common/Attachments/AttachmentList";
import FileSelector from "../../components/fileSelector";
function TestError1() {
  const a=2;
  a.nono();
}
import {
  IncidentCategory,
  IncidentPiority,
  IncidentStatus,
  priorityOptions,
} from "../../constants";

import { GET_SOCIETY_LEVEL_INCIDENTS } from "../../graphql/queries/getSocietyLevelIncidents";
import { GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY } from "../../graphql/queries/getActiveServiceSubscriptionsBySociety";
import { GET_SOCIETY_MEMBERS } from "../../graphql/queries/getSocietyMembers";
import {
  ADD_INCIDENT_COMMENT,
  CREATE_INCIDENT,
} from "../../graphql/mutations/incident/createIncident";
import { toast } from "react-toastify";
import { GET_ATTACHMENTS } from "../../graphql/queries/getAttachments";
import { UPDATE_INCIDENT_BY_ID } from "../../graphql/mutations/incident/updateIncident";
import { ACTIONS } from "../../helpers/validations";
import { GET_PARTNER_MEMBERS_BY_TYPE_QUERY } from "../../graphql/queries/getPartnerMembers";

const getMemberType = (type) => type?.split("_").join(" ");

const PAGE_SIZE = 10;

const Complaints = () => {
  const photoManagerRef = useRef(null);
  let [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).subtract(1, "month").toDate(),
    endDate: new Date(),
  });
  let [selectedIncident, setSelectedIncident] = useState({}); // for right side details
  let [showCreateForm, setShowCreateForm] = useState(false);
  let [activeSubs, setActiveSubs] = useState(null);
  const [societyMembers, setSocietyMembers] = useState([]);
  const [complaintAttachments, setComplaintAttachments] = useState([]);
  let [showImageSelectorModal, setShowImageSelectorModal] = useState(false);

  const initialForm = {
    serviceSubscription: null, // !ID
    summary: null, //String!
    description: null, //String!
    priority: null, //String!
    category: null, //String!
    assignee: null, //String! = "Active"
  };

  let [createComplaintFormData, setCreateComplaintFormData] =
    useState(initialForm);
  let { activeAccountId, user } = useSelector((state) => state.authSlice);

  const [createIncident] = useMutation(CREATE_INCIDENT);
  const [updateIncidentStatus] = useMutation(UPDATE_INCIDENT_BY_ID);
  const [addIncidentComment] = useMutation(ADD_INCIDENT_COMMENT);

  const [getAttachmentQuery, { data, loading, refetch: refetchAttachments }] =
    useLazyQuery(GET_ATTACHMENTS, {
      variables: {
        parentId: selectedIncident?.objectId,
        module: "Service_Incident_Photos", // 'Service_Task_Photos',
      },
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    console.log("selectedIncient", selectedIncident);
    if (selectedIncident?.objectId) {
      getAttachmentQuery();
    }
  }, [selectedIncident]);

  const {
    data: incidentData,
    loading: incidentsLoading,
    refetch: refetchIncidentData,
  } = useQuery(GET_SOCIETY_LEVEL_INCIDENTS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: PAGE_SIZE,
      societyId: activeAccountId,
      startDate: moment(dateRange.startDate).startOf("day").toDate(),
      endDate: moment(dateRange.endDate).endOf("day").toDate(),
      status: [
        IncidentStatus.OPEN,
        IncidentStatus.IN_PROGRESS,
        IncidentStatus.RESOLVED,
      ],
    },
  });

  const { data: societyMembersRes } = useQuery(GET_SOCIETY_MEMBERS, {
    fetchPolicy: "network-only",
    variables: {
      societyId: activeAccountId,
      types: ["SOCIETY_ADMIN", "SOCIETY_MANAGER", "INSPACCO_KAM"],
    },
    skip: !activeAccountId,
  });

  const [getActiveServiceSubs] = useLazyQuery(
    GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY,
    {
      onCompleted: (data) => setActiveSubs(data),
      skip: !activeAccountId,
    }
  );

  const handleGetActiveSubs = () =>
    getActiveServiceSubs({
      variables: {
        societyId: activeAccountId,
        today: moment().toDate(),
      },
    });

  useEffect(() => {
    handleGetActiveSubs();
  }, []);

  useEffect(() => {
    if (!isEmpty(societyMembersRes?.societyMembers?.edges)) {
      const societymembers = societyMembersRes.societyMembers.edges.map(
        (societyMember) => ({
          label:
            getMemberType(societyMember.node.type) +
            " - " +
            societyMember.node.member.firstName +
            " " +
            societyMember.node.member.lastName,
          value: societyMember.node.member.objectId,
          assignedGroup: "SOCIETY",
        })
      );
      setSocietyMembers(societymembers || []);
    }
  }, [societyMembersRes]);

  const _handleAddAttachmentsToComplaint = (attachments) => {
    console.log("attachments", attachments);
    setShowImageSelectorModal(false);
    setComplaintAttachments([...complaintAttachments, attachments]);
  };

  const _handleRaiseComplaint = async () => {
    console.log("createComplaintFormData", createComplaintFormData);
    let isValidated = true;
    if (!createComplaintFormData.serviceSubscription) {
      toast.error("Please Select Service");
      isValidated = false;
    }
    if (!createComplaintFormData.category) {
      toast.error("Please Select Category");
      isValidated = false;
    }
    if (!createComplaintFormData.priority) {
      toast.error("Please Select Priority");
      isValidated = false;
    }
    if (!createComplaintFormData.summary) {
      toast.error("Please Provide Summary");
      isValidated = false;
    }
    if (!createComplaintFormData.assignee) {
      toast.error("Please Select Assignee");
      isValidated = false;
    }
    if (!isValidated) {
      return;
    }
    createComplaintFormData.status = IncidentStatus.OPEN;
    const mutationData = {
      category: createComplaintFormData.category.value,
      priority: createComplaintFormData.priority.value,
      status: createComplaintFormData.status,
      summary: createComplaintFormData.summary,
      serviceSubscription: createComplaintFormData.serviceSubscription.value,
      description: createComplaintFormData.description || "",
      assignee: createComplaintFormData.assignee.value,
      assignedGroup: createComplaintFormData.assignedGroup,
    };
    const createdIncident = await createIncident({
      variables: mutationData,
    });
    const incidentId = createdIncident.data?.createIncident?.incident?.objectId;
    const data = createdIncident.data?.createIncident;
    if (incidentId) {
      let permissionGroupId = `SOCIETY_${data?.incident?.serviceSubscription?.society?.objectId}|PARTNER_${data?.incident?.serviceSubscription?.partner?.objectId}`;
      for await (const photo of complaintAttachments) {
        await photoManagerRef.current.storeAttachment(
          incidentId,
          photo.uploadedFile,
          "Service_Incident_Photos",
          permissionGroupId,
          photo.imageName
        );
      }
    }
    toast.success("Complaint reported successfully.");
    setShowImageSelectorModal(false);
    setCreateComplaintFormData(initialForm);
  };

  const filterIncidents = ({ text: filterStr }) =>
    incidentData?.incidents?.edges?.filter(
      ({ node }) =>
        node.summary?.toLowerCase().indexOf(filterStr?.toLowerCase()) > -1
    );

  async function handleUpdateAttachment(attachment) {
    if (!attachment) return;
    refetchAttachments();
    toast.success(`Incident  Attachment Uploaded successfully`);
  }

  async function handleUpdate(data) {
    console.log("handleUpdate incdient", data);
    if (selectedIncident.status != data.status) {
      const updatedValues = {
        id: selectedIncident.objectId,
        ...selectedIncident,
        status: data.status,
        assignee: selectedIncident?.assignee?.objectId,
        action: ACTIONS.editIncidentStatus,
        value: data.status,
        userId: user?.objectId,
      };
      await updateIncidentStatus({ variables: updatedValues });
      refetchIncidentData();
      toast.success(`Incident  Status Updated successfully`);
    } else if (data.comment) {
      await addIncidentComment({
        variables: {
          incidentId: selectedIncident?.objectId,
          comment: data.comment,
        },
      });
      refetchIncidentData();
      toast.success(`Incident Comment Added successfully`);
    }
  }

  useEffect(() => {
    setSelectedIncident({});
  }, [activeAccountId]);

  const refreshDataClicked = () => refetchIncidentData();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showCreateForm) {
          setShowCreateForm();
        } 
      }
    };

    if (showCreateForm) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateForm, setShowCreateForm]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <DashboardTopBar
        dateRange={dateRange}
        updateDashboardPeriod={setDateRange}
        onRefreshDataClicked={refreshDataClicked}
        actions={
          <Button
            paddingClass="0"
            onClick={() => {
              setCreateComplaintFormData(initialForm);
              setShowCreateForm(true);
            }}
            className="gap-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Raise Complaint
          </Button>
        }
      />
      <Drilldown
        {...{
          source: "complaints",
          itemIcon: <ComplaintsIcon className="w-6 h-6 text-accent" />,
          leftSideLoading: incidentsLoading,
          rightSideLoading: false,
          listData: incidentData?.incidents?.edges,
          onUploadDone: handleUpdateAttachment,
          listFilterFn: filterIncidents,
          onItemSelect: setSelectedIncident,
          handleSubmit: handleUpdate,
          activeItemDetails: {
            ...selectedIncident,
            attachments: data?.attachments,
            // comments: serviceRequestComments,
          },
        }}
      />
      {showCreateForm ? (
        <Modal
          title="Raise New Complaint"
          closeModal={() => setShowCreateForm(false)}
          showModal={showCreateForm}
          onSubmit={_handleRaiseComplaint}
        >
          <CreateNewComplaintForm
            {...{
              data: createComplaintFormData,
              setData: setCreateComplaintFormData,
              showImageSelectorModal,
              setShowImageSelectorModal,
              activeSubs,
              societyMembers,
              complaintAttachments,
            }}
          />
        </Modal>
      ) : null}
      <Modal
        title="Upload Files"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        fullscreen
        showBtns={false}
      >
        <FileSelector
          ref={photoManagerRef}
          module="Service_Incident_Photos"
          parentId={null}
          onImageSelected={_handleAddAttachmentsToComplaint}
        />
      </Modal>
    </div>
  );
};

export default Complaints;

const CreateNewComplaintForm = ({
  data,
  setData,
  activeSubs,
  societyMembers,
  showImageSelectorModal,
  setShowImageSelectorModal,
  complaintAttachments,
}) => {
  

  const categoryOptions = [
    {
      label: IncidentCategory.SERVICE_QUALITY,
      value: IncidentCategory.SERVICE_QUALITY,
    },
    { label: IncidentCategory.ATTENDANCE, value: IncidentCategory.ATTENDANCE },
    { label: IncidentCategory.PAYMENT, value: IncidentCategory.PAYMENT },
    { label: IncidentCategory.OTHER, value: IncidentCategory.OTHER },
  ];

  const activeServices = activeSubs?.serviceSubscriptions?.edges.map(
    ({ node }) => {
      return {
        value: node.objectId,
        label: node.service.name,
        partner: node?.partner,
      };
    }
  );
  console.log("==incident", data);
  const { partner } =
    activeServices?.find(
      (service) =>
        service.value ===
        (typeof data?.serviceSubscription === "object"
          ? data?.serviceSubscription?.value
          : data?.serviceSubscription)
    ) || {};
  console.log("partner", partner);
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
  console.log("partnerMembers", partnerMembers);
  return (
    <>
      <div className="flex flex-col items-center pt-4 mx-6 overflow-y-auto gap-y-4">
        {/* <TestError1/> */}
        <div className="mx-6 mt-6 form-control sm:w-full md:w-full lg:w-1/2 ">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Services <span className="text-red-500">*</span>
          </label>
          <Select
            options={activeServices}
            native={false}
            onChange={(value) =>
              setData({ ...data, serviceSubscription: value })
            }
            value={data.serviceSubscription}
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Category <span className="text-red-500">*</span>
          </label>
          <div className=" form-control sm:w-full md:w-full lg:w-1/10">
            <Select
              options={categoryOptions}
              native={false}
              onChange={(value) => setData({ ...data, category: value })}
              value={data.category}
            />
          </div>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className=" form-control sm:w-full md:w-full lg:w-1/10">
            <Select
              options={priorityOptions}
              native={false}
              onChange={(value) => setData({ ...data, priority: value })}
              value={data.priority}
            />
          </div>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Summary <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={({ target: { value } }) =>
              setData({ ...data, summary: value })
            }
            type="text"
            value={data.summary}
            placeholder="Summary"
            className="w-full h-12 input input-md input-bordered "
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Description
          </label>
          <textarea
            onChange={({ target: { value } }) =>
              setData({ ...data, description: value })
            }
            value={data.description}
            type="text"
            placeholder="Description"
            className="w-full textarea textarea-bordered textarea-md "
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <div className=" form-control sm:w-full md:w-full lg:w-1/10">
            <label className="pb-1 text-lg font-medium label-text text-accent">
              Assignee <span className="text-red-500">*</span>
            </label>
            <Select
              menuPlacement="top"
              options={partnerMembers?.map((partner_member) => {
                return {
                  label: `${partner_member?.member?.firstName} ${
                    partner_member?.member?.lastName
                  }( ${partner_member?.type?.split("_").join(" ")} )`,
                  value: partner_member?.member?.objectId,
                };
              })}
              native={false}
              onChange={(value) => setData({ ...data, assignee: value })}
              value={data.assignee}
            />
          </div>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <div className="form-control sm:w-full md:w-full lg:w-1/10">
            <div className="flex justify-between">
              <label className="pb-1 text-lg font-medium label-text text-accent">
                Attachments
              </label>
              <HoverIcon
                onClick={() =>
                  setShowImageSelectorModal(!showImageSelectorModal)
                }
                icon={<PaperClipIcon className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2 pt-6">
              <AttachmentList isAttachmentImage data={complaintAttachments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
