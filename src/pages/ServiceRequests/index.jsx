import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import moment from "moment";
import _debounce from "lodash/debounce";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import ServiceRequestsIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import _ from "lodash";
import {
  _createServiceRequestSubqueryObj,
  _getStatusType,
  getRequirementDataAsPlainObject,
  pickupDataFromResponse,
  searchInObject,
} from "../../helpers/utils";
import {
  GET_ALL_SERVICE_REQUESTS_BY_ADMIN_FILTERS,
} from "../../graphql/queries/getServiceRequests";
import { GET_SERVICE_REQUEST_COMMENTS } from "../../graphql/queries/getServiceRequestComments";

// import { GET_SERVICE_BY_ID } from "../../graphql/queries/getServiceById";
import { GET_SERVICE_REQUEST_DETAILS } from "../../graphql/queries/getServiceRequestById";


import Button from "../../components/common/neomorphic/Button";
import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
import Modal from "../../components/common/Modal";
import Drilldown from "../../components/common/Cards/Drilldown";
import Select from "../../components/common/neomorphic/Select";
import { GET_SERVICES } from "../../graphql/queries/getPopularServices";
import { toast } from "react-toastify";
import { ACTIONS } from "../../helpers/validations";
import {
  UPDATE_SERVICE_REQUEST_PRIORITY_BY_ID,
  UPDATE_SERVICE_REQUEST_RESOLUTION_COMMENT,
  UPDATE_SERVICE_REQUEST_STATUS_BY_ID,
} from "../../graphql/mutations/serviceRequest/updateServiceRequestStatus";
import { ADD_SERVICE_REQUEST_COMMENT } from "../../graphql/mutations/serviceRequest/addServiceRequestComment";
import { GET_ATTACHMENTS } from "../../graphql/queries/getAttachments";
import CreateNewSRForm from "./CreateNewSRForm";
import FiltersBar from "../../components/common/FilterBar";
import {
  SERVICE_REQUEST_STATUS_OPTIONS,
  priorityOptions,
  serviceSubServices,
} from "../../constants";
import ServiceRequestBulkUpload from "./ServiceReqeustBulkUpload";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ConfirmationWrapper from "../../components/common/Dialog/ConfirmationWrapper";
import {
  ArrowUpOnSquareIcon,
  ArrowUpOnSquareStackIcon,
  ListBulletIcon,
  TableCellsIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DELETE_SERVICE_REQUEST } from "../../graphql/mutations/serviceRequest/deleteServiceRequest";
import ServiceReqeuestDetails from "./ServiceReqeuestDetails";
import CustomDropdown from "../../components/common/CustomDropdown";
import IconToggle from "../../components/common/Toggle/IconToggle";
import ServiceRequestDataTable from "./ServiceRequestDataTable";
import { Radio } from "react-daisyui";
import { useLocation } from "react-router-dom";

function getQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const radioOptions = [
  { value: "all", label: "All" },
  { value: "single", label: "By SR Number" },
];
const ServiceRequests = () => {
  const query = getQueryParams();
  const [layoutMode, setLayoutMode] = useState(1);
  const [filterMode, setFilterMode] = useState("all");
  let [selectedSR, setSelectedSR] = useState({});
  let [serviceRequests, setServiceRequests] = useState([]);
  let [showCreateForm, setShowCreateForm] = useState(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const { t } = useTranslation();
  let {
    activeAccountId,
    user,
    activeSociety,
    allServices = [],
  } = useSelector((state) => state.authSlice);

  const initialFormData = () => {
    let formObj = {
      dateRange: {
        startDate: query.get('startDate') ? moment(query.get('startDate')) : moment(new Date()).subtract(1, "month").toDate(),
        endDate: query.get('endDate') ? moment(query.get('endDate')) : new Date(),
      },
      client: {
        label: activeSociety?.label,
        value: activeSociety?.objectId,
      }
    };

    if (query.get('status')) {
      formObj["parentStatus"] = {
        label: query.get('status'),
        value: query.get('status')
      }
    }

    if (query.get('subStatus')) {
      const subStatusValue = SERVICE_REQUEST_STATUS_OPTIONS.find(ele =>
        query.get('subStatus') === ele?.label);
      formObj["status"] = {
        label: query.get('subStatus'),
        value: subStatusValue?.value
      }
    }

    if (query.get('serviceId')) {
      formObj["service"] = {
        label: query.get('serviceId'),
        value: query.get('serviceId')
      }
    }
    return formObj;
  };

  const [formData, setFormData] = useState(initialFormData());
  const [getAttachmentQuery, { data, loading, refetch: refetchAttachments }] =
    useLazyQuery(GET_ATTACHMENTS, {
      variables: {
        parentId: selectedSR?.objectId,
        module: "InspaccoAdmin", // 'Service_Task_Photos',
      },
      fetchPolicy: "network-only",
    });

  const services = allServices;

  if (activeSociety?.services?.edges?.length) {
    const societyServices = pickupDataFromResponse({
      data: {
        services: activeSociety?.services,
      },
    });
    if (("SocietyServices", societyServices)) services.push(...societyServices);
  }
  const [addServiceRequestComment] = useMutation(ADD_SERVICE_REQUEST_COMMENT);
  const [updateServiceRequestStatus] = useMutation(
    UPDATE_SERVICE_REQUEST_STATUS_BY_ID
  );
  const [updateServiceRequestPriority] = useMutation(
    UPDATE_SERVICE_REQUEST_PRIORITY_BY_ID
  );
  const [updateServiceRequestResolutionComment] = useMutation(
    UPDATE_SERVICE_REQUEST_RESOLUTION_COMMENT
  );
  const [
    fetchServiceRequests,
    {
      data: serviceRequestsByDate,
      loading: srByDateLoading,
      refetch: refetchServiceRequests,
    },
  ] = useLazyQuery(GET_ALL_SERVICE_REQUESTS_BY_ADMIN_FILTERS, {
    fetchPolicy: "network-only",
  });

  const [
    getServiceRequestComments,
    {
      data: serviceRequestComments,
      loading: commentsLoading,
      refetch: refetchServiceRequestComments,
    },
  ] = useLazyQuery(GET_SERVICE_REQUEST_COMMENTS, {
    variables: {
      serviceRequestId: selectedSR.objectId,
    },
    fetchPolicy: "network-only",
  });

  const [
    getServiceRequestDetails,
    {
      data: serviceRequestDetails = {},
      loading: srDetailsLoading,
      refetch: refetchServiceRequestDetails,
    },
  ] = useLazyQuery(GET_SERVICE_REQUEST_DETAILS, {
    fetchPolicy: "network-only",
    variables: { id: selectedSR.id },
  });

  useEffect(() => {
    if (serviceRequestsByDate?.serviceRequests?.edges)
      setServiceRequests(serviceRequestsByDate?.serviceRequests?.edges);
  }, [serviceRequestsByDate?.serviceRequests?.edges]);

  useEffect(() => {
    if (selectedSR.id) {
      getServiceRequestDetails();
      getAttachmentQuery();
      getServiceRequestComments();
    }
  }, [selectedSR.id]);

  useEffect(() => {
    //initialFormData()
    const updatedFormdata = {
      ...formData,
      client: {
        label: activeSociety?.label,
        value: activeSociety?.objectId,
      },
    };
    const subQuery = _createServiceRequestSubqueryObj(updatedFormdata);

    fetchServiceRequests({
      variables: { subQuery, limit: 1000, skip: 0 },
    });

    setFormData(updatedFormdata);
  }, [activeSociety?.objectId]);

  const filterServiceRequests = (filter) => {
    if (filter.text) {
      return serviceRequests.filter(
        ({ node }) =>
          node?.service?.name.toLowerCase().includes(filter.text) ||
          (node?.displayId + "")?.includes(filter.text) ||
          searchInObject(
            getRequirementDataAsPlainObject(node?.requirement),
            filter.text
          )
      );
    }
    return serviceRequests;
  };

  const toggleModal = () => setShowCreateForm(!showCreateForm);

  async function handleUpdate(data) {
    console.log("handleUpdate Service Request", data, selectedSR);
    if (selectedSR.status != data.status) {
      const updatedValues = {
        id: selectedSR?.objectId,
        status: data.status,
      };
      await updateServiceRequestStatus({ variables: updatedValues });
      
      toast.success(` Status Changed successfully`);
    } else if (selectedSR.priority != data.priority) {
      const updatedValues = {
        id: selectedSR?.objectId,
        priority: data.priority,
      };
      await updateServiceRequestPriority({ variables: updatedValues });
      
      toast.success(` Priority Changed successfully`);
    } else if (selectedSR.resolutionComment != data.resolutionComment) {
      const updatedValues = {
        id: selectedSR?.objectId,
        resolutionComment: data?.resolutionComment,
      };
      await updateServiceRequestResolutionComment({ variables: updatedValues });
      
      toast.success(` Resolution comment added`);
    } else if (data.comment) {
      await addServiceRequestComment({
        variables: {
          serviceRequestId: selectedSR?.objectId,
          userId: user?.objectId,
          comment: data.comment,
        },
      });
      toast.success(` Comment Added successfully`);
      getServiceRequestComments();
      // setSelectedIncident({...selectedIncident,comment:''})
    }
    handleSearch();
  }
  function handleSearch(pageNo) {
    const updatedFormdata = {
      ...formData,
      client: {
        label: activeSociety?.label,
        value: activeSociety?.objectId,
      },
    };
    const subQuery = _createServiceRequestSubqueryObj(updatedFormdata);

    fetchServiceRequests({
      variables: { subQuery, limit: 1000, skip: 0 },
    });
  }
  

  function handleStatusChange(status) {
    handleUpdate({
      status: status,
    });
  }
  const subServiceOptions = serviceSubServices
    ?.find(
      (service) =>
        service?.name?.toLowerCase() ===
        formData?.service?.label?.split(" ")?.[0]?.toLowerCase()
    )
    ?.subServices?.map((a) => ({
      label: a?.name,
      value: a?.name,
      priority: a?.priority,
    }));
  useEffect(() => {
    if (filterMode === "all") {
      setFormData({
        dateRange: {
          startDate: moment(new Date()).subtract(1, "month").toDate(),
          endDate: new Date(),
        },
      });
    } else {
      setFormData({});
    }
  }, [filterMode]);
  return (
    <div className="flex-col gap-2 p-4">
      <div className="justify-between mb-3 menu-target">
        <div>
          <div className="flex items-center">
            {radioOptions.map((option) => (
              <>
                <Radio
                  value={option.value}
                  checked={filterMode === option.value}
                  onChange={() => setFilterMode(option.value)}
                  label={option.label}
                />
                <label className="pl-2 pr-2">
                  <span>{option.label}</span>
                </label>
              </>
            ))}
          </div>
          <FiltersBar
            loading={srByDateLoading}
            filters={[
              {
                label: "Date Range",
                name: "dateRange",
                type: "DATERANGE",
                value: formData.dateRange,
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
              },
              {
                name: "displayId",
                label: "Service Request Number",
                value: formData.displayId,
                type: "NUMBER",
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
              },
              {
                label: "Status",
                name: "parentStatus",
                type: "SELECT",
                menuPortalTarget: ".menu-target",
                native: false,
                value: formData.parentStatus,
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
                options: Object.keys(
                  _.groupBy(SERVICE_REQUEST_STATUS_OPTIONS, "status")
                )?.map((key) => {
                  return {
                    label: key,
                    value: key,
                  };
                }),
              },
              {
                label: "Sub Status",
                name: "status",
                type: "SELECT",
                menuPortalTarget: ".menu-target",
                native: false,
                value: formData.status,
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
                options: formData.parentStatus
                  ? SERVICE_REQUEST_STATUS_OPTIONS?.filter(
                    (a) => a?.status === formData?.parentStatus?.value
                  )
                  : SERVICE_REQUEST_STATUS_OPTIONS,
              },
              {
                label: "Service",
                name: "service",
                type: "SELECT",
                menuPortalTarget: ".menu-target",
                native: false,
                value: formData.service || "",
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
                options:
                  services?.map((service) => {
                    return {
                      label: service?.name,
                      value: service?.objectId,
                    };
                  }) || [],
              },
              {
                label: "Sub Service",
                name: "subService",
                type: "SELECT",
                menuPortalTarget: ".menu-target",
                native: false,
                value: formData.subService,
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
                options: subServiceOptions,
              },
              {
                label: "Priority",
                name: "priority",
                type: "SELECT",
                menuPortalTarget: ".menu-target",
                native: false,
                value: formData.priority,
                setData: (obj) =>
                  setFormData({
                    ...formData,
                    ...obj,
                  }),
                options: priorityOptions,
              },
            ]?.filter((obj) => {
              if (filterMode == "single" && obj.name != "displayId") {
                return false;
              }
              if (filterMode == "all" && obj.name == "displayId") {
                return false;
              }
              return true;
            })}
            onSubmit={() => handleSearch(1)}
            onClear={() => {
              setFormData({
                dateRange: {
                  startDate: moment(new Date()).subtract(1, "month").toDate(),
                  endDate: new Date(),
                },
              });
              fetchServiceRequests();
            }}
          />
        </div>

        <div className="flex justify-end mt-2 ml-10 mr-5 ">
          <div className="pl-3 mr-40">
            <IconToggle
              toggleIcon1={<TableCellsIcon className="w-4 h-4" />}
              toggleIcon2={<ListBulletIcon className="w-4 h-4" />}
              {...{
                value: layoutMode,
                onChange: (mode) => setLayoutMode(mode),
                //   Icon: <View className="w-4 h-4" />,
              }}
            />
          </div>
          <Button
            paddingClass="0"
            onClick={(e) => {
              toggleModal();
            }}
            className="gap-2  capitalize tracking-[0.30px] font-medium btn-sm text-sm"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Create Service Request
          </Button>
          <Button
            paddingClass="0"
            onClick={(e) => {
              setShowBulkUploadModal(true);
            }}
            className="gap-2 ml-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
          >
            <ArrowUpOnSquareStackIcon className="w-4 h-4" />
            Bulk Upload
          </Button>
          {/* <ConfirmationWrapper
            onConfirm={() => {
              handleDeleteServiceRequest();
            }}
            confirmationMessage={`Are you Sure you want Delete Service Request ?`}
          >
            <Button
              disabled={!selectedSR?.id}
              className="ml-1 btn-error btn-sm"
            >
              <TrashIcon className="w-3 h-3" color="white" /> &nbsp;{t("general.delete")}
            </Button>
          </ConfirmationWrapper> */}
          {layoutMode ? (
            <CustomDropdown
              className="ml-2"
              label="Actions"
              // disabled={selectedSR}
              // items={SERVICE_REQUEST_STATUS_OPTIONS?.filter(a=>[''])}
              items={[
                {
                  label: "To Be Worked Upon",
                  action: () => handleStatusChange("TO_BE_WORKED_UPON"),
                  disabled: !(
                    selectedSR?.status == "ORDER_ON_HOLD" ||
                    selectedSR?.status == "ORDER_LOST"
                  ),
                },
                {
                  label: "Quotation Approved",
                  action: () => handleStatusChange("QUOTATION_APPROVED"),
                  disabled: selectedSR?.status !== "QUOTATION_APPROVAL_PENDING",
                },
                {
                  label: "Send Revised Quotation",
                  action: () => handleStatusChange("REVISED_QUOTATION_PENDING"),
                  disabled: selectedSR?.status !== "QUOTATION_APPROVAL_PENDING",
                },
                {
                  label: "Order on Hold",
                  action: () => handleStatusChange("ORDER_ON_HOLD"),
                  disabled:
                    !selectedSR?.objectId ||
                    selectedSR?.status == "ORDER_ON_HOLD",
                },
                {
                  label: "Order Lost",
                  action: () => handleStatusChange("ORDER_LOST"),
                  disabled:
                    !selectedSR?.objectId || selectedSR?.status == "ORDER_LOST",
                },
              ]}
            />
          ) : null}
        </div>
      </div>

      {/* <DashboardTopBar
        dateRange={dateRange}
        updateDashboardPeriod={setDateRange}
        onRefreshDataClicked={handleRefresh}
        actions={
          <Button
            paddingClass="0"
            onClick={(e) => {
             
              toggleModal();
            }}
            className="gap-2  capitalize tracking-[0.30px] font-medium btn-sm text-sm"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Create New Service Request
          </Button>
        }
      /> */}
      {layoutMode ? (
        <Drilldown
          {...{
            handleSubmit: handleUpdate,
            detailsComp: <ServiceReqeuestDetails serviceRequest={selectedSR} />,
            source: "sr",
            itemIcon: <ServiceRequestsIcon className="w-6 h-6 text-accent" />,
            leftSideLoading: srByDateLoading,
            rightSideLoading: srDetailsLoading && commentsLoading,
            listData: serviceRequests,
            listFilterFn: filterServiceRequests,
            onItemSelect: setSelectedSR,
            activeItemDetails: {
              ...selectedSR,
              ...serviceRequestDetails?.serviceRequest,

              comments: serviceRequestComments?.serviceRequest?.comments,
              attachments: data?.attachments,
            },
          }}
        />
      ) : (
        <ServiceRequestDataTable
          data={serviceRequestsByDate}
          loading={srByDateLoading}
        />
      )}
      {showCreateForm ? (
        <Modal
          title="Create New Service Request"
          closeModal={toggleModal}
          showModal={showCreateForm}
          showBtns={false}
          fullscreen={true}
        // onSubmit={handleCreateNewSR}
        >
          <CreateNewSRForm
            {...{
              onCloseCallback: () => {
                setShowCreateForm(false);
                handleSearch();
              },
              services: services?.map((service) => {
                return {
                  label: service.name,
                  value: service.objectId,
                };
              }),
              selectedSociety: activeSociety,
              isAdminPage: false,
            }}
          />
        </Modal>
      ) : null}
      {showBulkUploadModal && (
        <Modal
          title="Bulk Upload Service Requst"
          closeModal={() => {
            setShowBulkUploadModal(false);
            window.location.reload();
          }}
          showModal={showBulkUploadModal}
          showBtns={false}
          fullscreen={true}
        // onSubmit={handleCreateNewSR}
        >
          <ServiceRequestBulkUpload onDone={refetchServiceRequests} />
        </Modal>
      )}
    </div>
  );
};

export default ServiceRequests;
