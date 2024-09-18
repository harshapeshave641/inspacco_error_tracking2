import React, { forwardRef, useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";

import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/20/solid/ChatBubbleLeftRightIcon";
import ComplaintsIcon from "@heroicons/react/24/outline/ShieldExclamationIcon";
import CalendarDaysIcon from "@heroicons/react/20/solid/CalendarDaysIcon";

import {
  _getPriorityType,
  _getStatusType,
  _isEmpty,
  _textSearch,
  pickupDataFromResponse,
} from "../../../helpers/utils";
import { ACTIONS } from "../../../helpers/validations";

import Drilldown from "../../../components/Admin/Drilldown";
import Modal from "../../../components/common/Modal";
import AttachmentList from "../../../components/common/Attachments/AttachmentList";
import FileSelector from "../../../components/fileSelector";

import {
  INCIDENT_STATUS_OPTIONS,
  IncidentCategory,
  IncidentPiority,
  IncidentStatus,
} from "../../../constants";

import {
  ADD_INCIDENT_COMMENT,
  CREATE_INCIDENT,
} from "../../../graphql/mutations/incident/createIncident";
import { GET_ATTACHMENTS } from "../../../graphql/queries/getAttachments";
import { UPDATE_INCIDENT_BY_ID } from "../../../graphql/mutations/incident/updateIncident";
import {
  GET_INCIDENTS,
  GET_TOTAL_INCIDENTS_COUNT,
  getIncidentSubQuery,
} from "../../../graphql/queries/getIncidents";
import { GET_SOCIETIES } from "../../../graphql/queries/society";
import { GET_ALL_PARTNERS } from "../../../graphql/queries/partners";

import Breadcrumb from "../../../components/common/Breadcrumb";
import Comments from "../../../components/common/Comments";
import DocumentManager from "../../../components/common/DocumentManager";
import Accordion from "../../../components/common/Accordion";
import FiltersBar from "../../../components/common/FilterBar";
import Badge from "../../../components/common/Badge";
import Select from "../../../components/common/neomorphic/Select";
import Button from "../../../components/common/neomorphic/Button";
import { GET_PARTNER_MEMBERS_BY_TYPE_QUERY } from "../../../graphql/queries/getPartnerMembers";
import Input from "../../../components/common/neomorphic/Input";
import HoverIcon from "../../../components/common/HoverIcon";
import { GET_ALL_SERVICES } from "../../../graphql/queries/service";
import { GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY } from "../../../graphql/queries/getActiveServiceSubscriptionsBySociety";
import EditableSelect from "../../../components/common/EditableSelect";
import { UPDATE_INCIDENT_ASSIGNMENT } from "../../../graphql/mutations/incident/updateIncidentAssignment";


const PAGE_SIZE = 10;

const AdminComplaints = () => {
  const [formData, setFormData] = useState({
    dateRange: {
      startDate: moment(new Date()).subtract(1, "month").toDate(),
      endDate: new Date(),
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState({}); // for right side details
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { activeAccountId, user } = useSelector((state) => state.authSlice);

  const [updateIncidentStatus] = useMutation(UPDATE_INCIDENT_BY_ID);
  const [updateIncidentAssignment] = useMutation(UPDATE_INCIDENT_ASSIGNMENT);
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
    if (selectedIncident?.objectId) getAttachmentQuery();
  }, [selectedIncident.objectId]);

  const [getIncidentsCount, { data: incidentCountData }] = useLazyQuery(
    GET_TOTAL_INCIDENTS_COUNT
  );

  const [getClients, { data: clientsData }] = useLazyQuery(GET_SOCIETIES);
  const [getVendors, { data: vendorsData }] = useLazyQuery(GET_ALL_PARTNERS);
  const [getServices, { data: servicesData }] = useLazyQuery(GET_ALL_SERVICES);

  const [
    getIncidents,
    {
      data: incidentData,
      loading: incidentsLoading,
      refetch: refetchIncidentData,
    },
  ] = useLazyQuery(GET_INCIDENTS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const updatedIncident = pickupDataFromResponse({ data }).find(
        ({ objectId }) => selectedIncident.objectId === objectId
      );
      if (updatedIncident) setSelectedIncident(updatedIncident);
    },
    fetchPolicy: "no-cache",
    // fetchPolicy: "network-only",
  });

  useEffect(() => {
    getClients();
    getVendors();
    getServices();
  }, []);

  function _createSubqueryObj(formData) {
    const subQuery = {};
    let queryObj = {};

    Object.keys(formData).forEach((key) => {
      if (key === "dateRange") {
        subQuery["AND"] = [
          {
            createdAt: { greaterThanOrEqualTo: formData.dateRange?.startDate },
          },
          { createdAt: { lessThanOrEqualTo: formData.dateRange?.endDate } },
        ];
      } else if (["client", "vendor", "service"].includes(key)) {
        if (key === "client") {
          queryObj = {
            society: { have: { objectId: { equalTo: formData[key].value } } },
          };
        } else if (key == "vendor") {
          queryObj = {
            ...queryObj,
            partner: { have: { objectId: { equalTo: formData[key].value } } },
          };
        } else if (key == "service") {
          queryObj = {
            ...queryObj,
            service: { have: { objectId: { equalTo: formData[key].value } } },
          };
        }
        subQuery["serviceSubscription"] = { have: queryObj };
      } else if (Array.isArray(formData[key])) {
        subQuery[key] = { in: formData[key] };
      } else {
        subQuery[key] = { equalTo: formData[key].value };
      }
    });
    return subQuery;
  }

  function handleSearch(pageNo) {
    setSelectedIncident({});
    const subQuery = _createSubqueryObj(formData);

    console.log("subQuery", formData, subQuery);
    getIncidentsCount({
      variables: { subQuery },
    });
    getIncidents({
      variables: {
        subQuery,
        limit: PAGE_SIZE,
        skip: (pageNo - 1) * PAGE_SIZE,
      },
    });
  }

  function handleClear() {
    const subQuery = getIncidentSubQuery({
      startDate: moment(formData.dateRange?.startDate).startOf("day").toDate(),
      endDate: moment(formData.dateRange?.endDate).endOf("day").toDate(),
    });
    getIncidentsCount({
      variables: { subQuery },
    });
    getIncidents({
      variables: { subQuery, limit: PAGE_SIZE, skip: 0 },
    });
    setFormData({
      dateRange: {
        startDate: moment(new Date()).subtract(1, "month").toDate(),
        endDate: new Date(),
      },
      society: "",
      status: "",
      partner: "",
      service: "",
    });
  }

  const filterIncidents = ({ text: filterStr }) => {
    const incidentFilters = ["summary", "status", "displayId", "priority"];
    return _textSearch({
      data: pickupDataFromResponse({ data: incidentData }),
      filters: incidentFilters,
      filterStr,
    });
  };

  async function handleUpdateAttachment(attachment) {
    if (!attachment) return;
    refetchAttachments();
    toast.success(`Incident Attachment Uploaded successfully!`);
  }

  async function handleUpdate(data) {
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
      toast.success(`Incident Status Updated successfully!`);
    } else if (data.comment) {
      await addIncidentComment({
        variables: {
          incidentId: selectedIncident?.objectId,
          comment: data.comment,
        },
      });
      refetchIncidentData();
      toast.success(`Incident Comment Added successfully`);
    } else if (data.assignee.objectId !== selectedIncident.assignee.objectId) {
      const updatedValues = {
        id: selectedIncident?.objectId,
        assignee: data.assignee.objectId,
        assignedGroup: selectedIncident.assignedGroup,
      };
      await updateIncidentAssignment({ variables: updatedValues });
      refetchIncidentData();
      toast.success(`Incident Assignee Updated successfully!`);
    }
  }

  useEffect(() => {
    handleSearch(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setSelectedIncident({});
  }, [activeAccountId]);

  const portalTarget = ".w-screen";


  return (
    <div>
      <div className="flex justify-between pb-2">
        <Breadcrumb
          className="self-center py-0"
          path={[{ route: "/", name: "Home" }, { name: "Complaints" }]}
        />
        <div className="text-right">
          <Button
            paddingClass="0"
            onClick={() => {
              // setCreateComplaintFormData(initialForm);
              setShowCreateForm(true);
            }}
            className="gap-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Raise Complaint
          </Button>
        </div>
      </div>
      <div className="px-4 py-2 mb-2 rounded-lg menu-target bg-base-100">
        <FiltersBar
        loading={incidentsLoading}
          filters={[
            {
              label: "Date Range",
              name: "dateRange",
              type: "DATERANGE",
              value: formData.dateRange || "",
              setData: (obj) => {
                setFormData({
                  ...formData,
                  ...obj,
                });
              },
            },
            {
              label: "Status",
              name: "status",
              type: "SELECT",
              menuPortalTarget: portalTarget,
              native: false,
              value: formData.status || "",
              setData: (obj) =>
                setFormData({
                  ...formData,
                  ...obj,
                }),
              options: [
                { label: "Open", value: "OPEN" },
                { label: "In Progress", value: "IN_PROGRESS" },
                { label: "Rejected", value: "REJECTED" },
              ],
            },
            {
              label: "Client",
              name: "client",
              type: "SELECT",
              menuPortalTarget: portalTarget,
              native: false,
              value: formData.client || "",
              setData: (obj) =>
                setFormData({
                  ...formData,
                  ...obj,
                }),
              options: [
                ...(clientsData?.societies?.edges.map(
                  ({ node: { name, objectId } }) => ({
                    label: name,
                    value: objectId,
                  })
                ) || []),
              ],
            },
            {
              label: "Vendor",
              name: "vendor",
              type: "SELECT",
              menuPortalTarget: portalTarget,
              native: false,
              value: formData.vendor || "",
              setData: (obj) =>
                setFormData({
                  ...formData,
                  ...obj,
                }),
              options: [
                ...(vendorsData?.partners?.edges?.map(
                  ({ node: { name, objectId } }) => ({
                    label: name,
                    value: objectId,
                  })
                ) || []),
              ],
            },
            {
              label: "Service",
              name: "service",
              type: "SELECT",
              menuPortalTarget: portalTarget,
              native: false,
              value: formData.service || "",
              setData: (obj) =>
                setFormData({
                  ...formData,
                  ...obj,
                }),
              options: [
                ...(servicesData?.services?.edges.map(
                  ({ node: { name, objectId } }) => ({
                    label: name,
                    value: objectId,
                  })
                ) || []),
              ],
            },
          ]}
          onSubmit={() => handleSearch(1)}
          onClear={() => handleClear()}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Drilldown
          {...{
            pagination: true,
            showSearch: true,
            onPageChange: setCurrentPage,
            paginationConfig: {
              current_page: currentPage,
              showRecords: false,
              total_pages: Math.ceil(
                (incidentCountData?.totalIncidents?.count || PAGE_SIZE) /
                  PAGE_SIZE
              ),
            },
            source: "complaints",
            leftSideLoading: incidentsLoading,
            rightSideLoading: false,
            listData: incidentData?.incidents?.edges,
            details_header: (
              <DetailsHeader
                data={selectedIncident}
                icon={<ComplaintsIcon className="w-6 h-6 text-accent" />}
                onSubmit={handleUpdate}
              />
            ),
            details_content: (
              <ComplaintDetails
                data={selectedIncident}
                onUploadDone={handleUpdateAttachment}
                onCommentAdd={handleUpdate}
              />
            ),
            listFilterFn: filterIncidents,
            onItemSelect: setSelectedIncident,
          }}
        />
        {showCreateForm ? (
          <Modal
            title="Raise New Complaint"
            closeModal={() => setShowCreateForm(false)}
            showBtns={false}
            showModal={showCreateForm}
          >
            <CreateNewComplaintForm
              {...{
                onCloseCallback: () => setShowCreateForm(false),
                onSubmitCallback: () => {
                  setShowCreateForm(false);
                  // refetchIncidentData();
                  // !hack - NTR later
                  window.location.reload();
                },
              }}
            />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default AdminComplaints;

const ComplaintDetails = ({
  data: selectedRecord,
  onUploadDone,
  onCommentAdd,
}) => {
  const [attachmentCount, setAttachmentCount] = useState(0);

  if (_isEmpty(selectedRecord)) return null;

  return (
    <Accordion
      data={[
        {
          icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
          title: `Comments (${selectedRecord?.comments?.edges?.length || 0})`,
          content: (
            <Comments
              edit={true}
              onSubmit={(v) => onCommentAdd({ ...selectedRecord, comment: v })}
              comments={selectedRecord?.comments?.edges}
            />
          ),
        },
        {
          icon: <PaperClipIcon className="w-4 h-4" />,
          title: `Attachments (${attachmentCount})`,
          content: (
            <>
              <DocumentManager
                module={"Service_Incident_Photos"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`SOCIETY_${selectedRecord?.serviceSubscription?.society?.objectId}|PARTNER_${selectedRecord?.serviceSubscription?.partner?.objectId}`}
                onUploadDone={onUploadDone}
                getAttachments={(attachs) => setAttachmentCount(attachs.length)}
              />
            </>
          ),
        },
      ]}
    />
  );
};

const DetailsHeader = ({ data: selectedRecord, icon, onSubmit }) => {
  const [status, setStatus] = useState(null);
  const [assignee, setAssignee] = useState({
    label: `${selectedRecord?.assignee?.firstName} ${selectedRecord?.assignee?.lastName}`,
    value: `${selectedRecord?.assignee?.firstName} ${selectedRecord?.assignee?.lastName}`,
  });

  useEffect(() => {
    setAssignee({
      label: `${selectedRecord?.assignee?.firstName} ${selectedRecord?.assignee?.lastName}`,
      value: `${selectedRecord?.assignee?.firstName} ${selectedRecord?.assignee?.lastName}`,
    });
  }, [selectedRecord.displayId]);

  const { data: partnerMemberData } = useQuery(
    GET_PARTNER_MEMBERS_BY_TYPE_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {
        partnerId: selectedRecord?.serviceSubscription?.partner?.objectId,
        type: ["PARTNER_ADMIN", "PARTNER_KAM"],
      },
      skip: !selectedRecord.objectId,
    }
  );

  const partnerMembers = pickupDataFromResponse({ data: partnerMemberData });

  function handleStatusChange(status) {
    onSubmit({ ...selectedRecord, status });
    setStatus(status);
  }

  function handleAssigneeChange(assignee) {
    onSubmit({ ...selectedRecord, assignee });
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full gap-2">
          <div className="inline-flex items-center gap-2">
            {icon}
            <div className="text-lg text-accent">
              Complaint #{selectedRecord.displayId}
            </div>
            {selectedRecord.priority && (
              <Badge
                text={selectedRecord.priority}
                color={_getPriorityType(selectedRecord.priority)}
              />
            )}
          </div>
          <div className="inline-flex gap-2">
            <div className="inline-flex items-center gap-5">
              {selectedRecord.status && (
                <div
                  style={{
                    color: "white",
                    // width: 160,
                    float: "right",
                    position: "relative",
                  }}
                  className="justify-end gap-2 "
                >
                  {["RESOLVED"].includes(selectedRecord.status) ? (
                    <Badge
                      text={selectedRecord.status
                        ?.split("_")
                        ?.join(" ")
                        ?.replace("SENT", "RECEIVED")}
                      color={_getStatusType(selectedRecord.status)}
                    />
                  ) : (
                    <Select
                      native={true}
                      className={
                        `btn-sm bg-${_getStatusType(
                          selectedRecord?.status,
                          true
                        )}` + ""
                      }
                      onChange={handleStatusChange}
                      options={INCIDENT_STATUS_OPTIONS}
                      value={status || selectedRecord?.status}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold flex-end text-accent justify-self-end">
              <div>
                <label className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span className="text-xs">Updated On</span>
                </label>
                <div className="text-sm font-medium text-center">
                  {(selectedRecord.updatedAt &&
                    moment(selectedRecord.updatedAt).format("DD MMM YYYY")) ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm font-medium">{selectedRecord.summary}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <label className="">
            <span className="label-text">Service</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord?.serviceSubscription?.service?.name}
          </div>
        </div>
        <div className="">
          <label className="">
            <span className="label-text">Requester</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord.createdBy?.firstName}{" "}
            {selectedRecord.createdBy?.lastName}
          </div>
        </div>
        <div>
          <label className="">
            <span className="label-text">Assigned To</span>
          </label>
          <div>
            {["OPEN", "IN_PROGRESS"].includes(selectedRecord.status) ? (
              <div className="-ml-4">
                <EditableSelect
                  menuPlacement="auto"
                  menuPortalTarget={".w-screen"}
                  options={
                    partnerMembers?.map((partner_member) => {
                      return {
                        label: `${partner_member?.member?.firstName} ${
                          partner_member?.member?.lastName
                        } (${partner_member?.type?.split("_").join(" ")})`,
                        value: partner_member?.member?.objectId,
                        assignee: partner_member?.member,
                      };
                    }) || []
                  }
                  onChange={({ label, value, assignee }) => {
                    setAssignee({ label, value });
                    handleAssigneeChange(assignee);
                  }}
                  value={assignee}
                />
              </div>
            ) : (
              <div className="text-sm font-medium">
                {selectedRecord?.assignee?.firstName}{" "}
                {selectedRecord?.assignee?.lastName}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="">
            <span className="label-text">Category</span>
          </label>
          <div className="text-sm font-medium">{selectedRecord.category}</div>
        </div>
        <div className="">
          <label className="">
            <span className="label-text">Society</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord?.serviceSubscription?.society?.name}
          </div>
        </div>
        <div className="">
          <label className="">
            <span className="label-text">Partner</span>
          </label>
          <div className="text-sm font-medium">
            {selectedRecord?.serviceSubscription?.partner?.name}
          </div>
        </div>
        {/* <div>
        <LabelValue label='Vendor' value={selectedRecord?.serviceSubscription?.partner?.name}/>
        <LabelValue label='Client' value={selectedRecord?.serviceSubscription?.society?.name}/>
      </div> */}
      </div>
    </div>
  );
};

const CreateNewComplaintForm = ({
  // setShowImageSelectorModal,
  // complaintAttachments,
  onCloseCallback,
  onSubmitCallback,
  // showImageSelectorModal,
  // _handleAddAttachmentsToComplaint,
}) => {
  const { activeRole, activeAccountId } = useSelector(
    (state) => state.authSlice
  );

  const photoManagerRef = useRef(null);
  const [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  const [complaintAttachments, setComplaintAttachments] = useState([]);

  const _handleAddAttachmentsToComplaint = (attachments) => {
    setShowImageSelectorModal(false);
    setComplaintAttachments([...complaintAttachments, attachments]);
  };

  useEffect(() => {
    return () => {
      onCloseCallback();
    };
  }, []);

  const isAdminRole = activeRole === "INSPACCO_ADMIN";
  const priorityOptions = [
    { label: "Low", value: IncidentPiority.LOW },
    { label: "Medium", value: IncidentPiority.MEDIUM },
    { label: "High", value: IncidentPiority.HIGH },
  ];
  const categoryOptions = Object.values(IncidentCategory).map((cat) => ({
    label: cat,
    value: cat,
  }));
  const initialForm = {
    ...(isAdminRole && { societyId: null }),
    serviceSubscription: null, // !ID
    summary: null, //String!
    description: null, //String!
    priority: null, //String!
    category: null, //String!
    assignee: null, //String! = "Active"
  };

  const [formData, setFormData] = useState(initialForm);
  const [activeServices, setActiveServices] = useState([]);
  const [createIncident] = useMutation(CREATE_INCIDENT);

  const [getClients, { data: clientsData }] = useLazyQuery(GET_SOCIETIES);
  const [getActiveServiceSubs, { loading: activeSubsLoading }] = useLazyQuery(
    GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY,
    {
      onCompleted: (data) =>
        setActiveServices(
          data?.serviceSubscriptions?.edges.map(({ node }) => ({
            value: node.objectId,
            label: node.service.name,
            partner: node?.partner,
          }))
        ),
      skip: isAdminRole ? !formData.societyId : !activeAccountId,
    }
  );

  const societyId = isAdminRole ? formData.societyId : activeAccountId;

  useEffect(() => {
    if (societyId)
      getActiveServiceSubs({
        variables: {
          societyId,
          today: moment().toDate(),
        },
      });
  }, [societyId]);

  useEffect(() => {
    if (isAdminRole) getClients();
  }, []);

  const { partner } =
    activeServices?.find(
      (service) =>
        service.value ===
        (typeof formData?.serviceSubscription === "object"
          ? formData?.serviceSubscription?.value
          : formData?.serviceSubscription)
    ) || {};

  const { data: partnerMemberData } = useQuery(
    GET_PARTNER_MEMBERS_BY_TYPE_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {
        partnerId: partner?.objectId,
        type: ["PARTNER_ADMIN", "PARTNER_KAM"],
      },
      skip: !partner?.objectId,
    }
  );

  const _handleRaiseComplaint = async () => {
    console.log("createComplaintFormData", formData, photoManagerRef);
    const createComplaintFormData = formData;
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
    if (!isValidated) return;

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
    onSubmitCallback();
    setFormData(initialForm);
  };

  const societies = pickupDataFromResponse({ data: clientsData });
  const partnerMembers = pickupDataFromResponse({ data: partnerMemberData });

  return (
    <>
      <div className="flex flex-col items-center pt-4 mx-6 overflow-y-auto gap-y-4">
        {isAdminRole && (
          <div className="mx-6 mt-6 form-control sm:w-full md:w-full lg:w-1/2 ">
            <label className="pb-1 text-lg font-medium label-text text-accent">
              Society <span className="text-red-500">*</span>
            </label>
            <Select
              options={
                societies?.map(({ name, objectId }) => ({
                  label: name,
                  value: objectId,
                })) || []
              }
              native={false}
              onChange={({ value }) =>
                setFormData({
                  ...formData,
                  societyId: value,
                  serviceSubscription: null,
                })
              }
              value={formData.societyId}
            />
          </div>
        )}
        <div
          className={`form-control sm:w-full md:w-full lg:w-1/2 mx-6 ${
            !isAdminRole ? "mt-6" : ""
          }`}
        >
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Services <span className="text-red-500">*</span>
          </label>
          <Select
            disabled={isAdminRole ? activeSubsLoading : false}
            options={activeServices}
            native={false}
            onChange={(value) =>
              setFormData({ ...formData, serviceSubscription: value })
            }
            value={formData.serviceSubscription}
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
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              value={formData.category}
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
              onChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
              value={formData.priority}
            />
          </div>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text text-accent">
            Summary <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={({ target: { value } }) =>
              setFormData({ ...formData, summary: value })
            }
            type="text"
            value={formData.summary}
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
              setFormData({ ...formData, description: value })
            }
            value={formData.description}
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
              onChange={(value) =>
                setFormData({ ...formData, assignee: value })
              }
              value={formData.assignee}
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
                onClick={setShowImageSelectorModal}
                icon={<PaperClipIcon className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2 pt-6">
              <AttachmentList isAttachmentImage data={complaintAttachments} />
            </div>
          </div>
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <div className="text-right">
            <Button
              onClick={() => {
                _handleRaiseComplaint();
              }}
              type="accent"
            >
              Submit
            </Button>
            &nbsp;&nbsp;
            <Button type="default" onClick={onCloseCallback}>
              Close
            </Button>
          </div>
        </div>
      </div>
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
    </>
  );
};
