import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Radio } from "react-daisyui";
import _ from "lodash";
import _debounce from "lodash/debounce";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

import {
  _createServiceRequestSubqueryObj,
  _getCorePropsFromNode,
  _getPriorityType,
  _getStatusType,
  _isEmpty,
  _textSearch,
  // getHumanReadableDateTime,
  getRequirementDataAsPlainObject,
  pickupDataFromResponse,
} from "../../../helpers/utils";

import Drilldown from "../../../components/Admin/Drilldown";
import Modal from "../../../components/common/Modal";
// import Badge from "../../../components/common/Badge";
// import Accordion from "../../../components/common/Accordion";
// import DocumentManager from "../../../components/common/DocumentManager";
// import Comments from "../../../components/common/Comments";
// import Requirements from "../../../components/Details/Requirements";
import FiltersBar from "../../../components/common/FilterBar";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Button from "../../../components/common/neomorphic/Button";
// import Select from "../../../components/common/neomorphic/Select";

import {
  GET_ALL_SERVICE_REQUESTS_BY_ADMIN_FILTERS,
  GET_SERVICE_REQUEST_ACTIVITY_HISTORY,
  GET_TOTAL_SR_COUNT,
  getServiceRequestsSubQuery,
} from "../../../graphql/queries/getServiceRequests";
import {
  ROLES,
  SERVICE_REQUEST_STATUS_OPTIONS,
  priorityOptions,
  serviceSubServices,
} from "../../../constants";
import { ADD_SERVICE_REQUEST_COMMENT } from "../../../graphql/mutations/serviceRequest/addServiceRequestComment";
import { UPDATE_SERVICE_REQUEST } from "../../../graphql/mutations/serviceRequest/updateServiceRequestStatus";
import CreateNewSRForm from "../../ServiceRequests/CreateNewSRForm";
import {
  ArrowUpOnSquareStackIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
// import { DELETE_SERVICE_REQUEST } from "../../../graphql/mutations/serviceRequest/deleteServiceRequest";
// import { useTranslation } from "react-i18next";
import IconToggle from "../../../components/common/Toggle/IconToggle";
import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/20/solid";
import CreateQuotationModal from "../../ServiceRequests/CreateQuotationModal";
import {
  // ClockIcon,
  ListBulletIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import ServiceRequestDataTable from "../../ServiceRequests/ServiceRequestDataTable";
// import SingleComment from "../../../components/common/SingleComment";
// import ActivityHistory from "../../../components/common/ActivityHistory";
import ServiceRequestBulkUpload from "../../ServiceRequests/ServiceReqeustBulkUpload";
// import CustomDropdown from "../../../components/common/CustomDropdown";
import { useLocation, useNavigate } from "react-router-dom";
// import FlatList from "../../../components/common/FlatList";
import { GET_SOCIETY_MEMBERS } from "../../../graphql/queries/getSocietyMembers";
import { GET_SERVICE_PARTNERS } from "../../../graphql/queries/partners";
import DetailsHeader from "./SRDetailsHeader";
import DetailsAccordion from "./SRDetailsAccordion";
import Details from "../../../components/Details/Details";
import SideDrawer from "../../../components/common/SideDrawer";
import Accordion from "../../../components/common/Accordion";
import Text from "../../../components/common/Typography/Text";
import Input from "../../../components/common/neomorphic/Input";
import Badge from "../../../components/common/Badge";
import FilterPillSection from "./FilterPillSection";

const PAGE_SIZE = 100;
const fieldsUpdateArray = [
  "priority",
  "visitDate",
  "status",
  "resolutionComment",
  "partner",
];

const radioOptions = [
  { value: "all", label: "All" },
  { value: "single", label: "By SR Number" },
];

function updateGridData(data) {
  const serviceRequests = pickupDataFromResponse({ data }) || [];
  return serviceRequests?.map((serviceRequest) => {
    const {
      displayId: srNumber,
      createdAt,
      visitDate,
      service: { objectId: serviceId, name: serviceName },
      society: { objectId: societyId, name: societyName },
      status,
      priority,
      requirement,
    } = serviceRequest || {};
    const requirementObj = getRequirementDataAsPlainObject(requirement);
    return {
      "Service Request No": srNumber,
      "SR Date Time": new Date(createdAt),
      "Service Name": serviceName,
      "Work Status": status,
      "Visit Time": visitDate ? new Date(visitDate) : "",
      Priority: priority,
      Client: societyName,
      ...requirementObj,
    };
  });
}

function getQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const AdminServiceRequests = () => {
  const query = getQueryParams();
  const portalTarget = ".menu-target";

  const {
    activeAccountId,
    user,
    allClients = [],
    allServices = [],
    activeSociety,
    activeRole,
    isAdmin,
  } = useSelector((state) => state.authSlice);

  const initialFormData = () => {
    let formObj = {
      dateRange: {
        startDate: query.get("startDate")
          ? moment(query.get("startDate"))
          : moment(new Date()).subtract(1, "month").toDate(),
        endDate: query.get("endDate")
          ? moment(query.get("endDate"))
          : new Date(),
      },
      client: {
        label: activeSociety?.label,
        value: activeSociety?.objectId,
      },
    };

    if (query.get("status")) {
      formObj["parentStatus"] = [
        {
          label: query.get("status"),
          value: query.get("status"),
        },
      ];
    }

    if (query.get("subStatus")) {
      const subStatusValue = SERVICE_REQUEST_STATUS_OPTIONS.find(
        (ele) => query.get("subStatus") === ele?.label
      );
      formObj["status"] = [
        {
          label: query.get("subStatus"),
          value: subStatusValue?.value,
        },
      ];
    }

    if (query.get("serviceId")) {
      formObj["service"] = {
        label: allServices?.find(
          (obj) => obj?.objectId === query.get("serviceId")
        )?.name,
        value: allServices?.find(
          (obj) => obj?.objectId === query.get("serviceId")
        )?.objectId,
      };
    }
    if (query.get("clientId")) {
      formObj["client"] = {
        label: allClients?.find(
          (obj) => obj?.objectId === query.get("clientId")
        )?.name,
        value: allClients?.find(
          (obj) => obj?.objectId === query.get("clientId")
        )?.objectId,
      };
    }
    return formObj;
  };

  const navigate = useNavigate();
  const [layoutMode, setLayoutMode] = useState(
    query.get("view") === "Table" ? 0 : 1
  );
  const [statusSearchStr, setStatusSearchStr] = useState("");
  const [subStatusSearchStr, setSubStatusSearchStr] = useState("");

  const [filterMode, setFilterMode] = useState("all");
  const [serviceRequests, setServiceRequests] = useState([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showCreateQuotationModal, setShowCreateQuotationModal] =
    useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSRDetailsModal, setShowSRDetailsModal] = useState(false);

  const [quotationReadOnlyMode, setQuotationReadOnlyMode] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [selectedServicePartners, setSelectedServicePartners] = useState([]);

  const [formData, setFormData] = useState(initialFormData());
  const [appliedFilters, setAppliedFilters] = useState(initialFormData());
  const [isFiltersSectionOpen, setIsFilterSectionOpen] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  const [addServiceRequestComment] = useMutation(ADD_SERVICE_REQUEST_COMMENT);
  const [updateServiceRequest] = useMutation(UPDATE_SERVICE_REQUEST);

  const [getPartnersData] = useLazyQuery(GET_SERVICE_PARTNERS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const partnersData = pickupDataFromResponse({ data }).map(
        ({ name, objectId }) => ({ value: objectId, label: name })
      );
      setSelectedServicePartners(partnersData);
    },
  });

  const [getServiceRequestActivityHistory] = useLazyQuery(
    GET_SERVICE_REQUEST_ACTIVITY_HISTORY,
    { fetchPolicy: "no-cache" }
  );
  const { data: societyMembersRes } = useQuery(GET_SOCIETY_MEMBERS, {
    fetchPolicy: "network-only",
    variables: {
      societyId: isAdmin ? formData?.client?.value : activeAccountId,
      types: ["SOCIETY_ADMIN", "SOCIETY_MANAGER", "INSPACCO_KAM"],
    },
    skip: !formData?.client?.value,
  });

  const [getTotalSRCount, { data: srCountData }] =
    useLazyQuery(GET_TOTAL_SR_COUNT);

  const [
    getServiceRequests,
    {
      data: serviceRequestsData,
      loading: srLoading,
      refetch: refetchServiceRequests,
    },
  ] = useLazyQuery(GET_ALL_SERVICE_REQUESTS_BY_ADMIN_FILTERS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      // setLoading(false);
      const result = updateGridData(data);
      console.log("result: ", result);
      // setGridData(result);
      const updatedService = pickupDataFromResponse({ data }).find(
        ({ objectId }) => selectedService.objectId === objectId
      );
      setServiceRequests(data?.serviceRequests?.edges);
      if (updatedService) setSelectedService(updatedService);
    },
    fetchPolicy: "no-cache",
    skip: !activeAccountId,
  });

  const societyMembers = pickupDataFromResponse({ data: societyMembersRes });

  useEffect(() => {
    getPartnersData({
      variables: {
        serviceName: selectedService?.service?.name,
      },
    });
  }, [selectedService.objectId]);

  useEffect(() => {
    handleSearch(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (filterMode === "all") setFormData(initialFormData());
    else setFormData({});
  }, [filterMode]);

  const toggleModal = () => setShowCreateForm(!showCreateForm);

  const toggleCreateQuotationModal = () => {
    if (quotationReadOnlyMode) setQuotationReadOnlyMode(false);
    if (showCreateQuotationModal) setSelectedQuotation({});
    setShowCreateQuotationModal(!showCreateQuotationModal);
  };

  const handleOpenQuotation = (selectedQuote, index) => {
    setShowCreateQuotationModal(true);
    setQuotationReadOnlyMode(true);
    setSelectedQuotation({ ...selectedQuote, index });
  };

  function handleSearch(pageNo) {
    // setLoading(true);
    if (!_isEmpty(formData)) setAppliedFilters(formData);

    const subQuery = _createServiceRequestSubqueryObj(
      isAdmin
        ? activeRole == ROLES.INSPACCO_KAM
          ? {
              ...formData,
              parentStatus: formData.parentStatus?.map(({ value }) => value),
              status: formData.status?.map(({ value }) => value),
              client: {
                value:
                  formData?.client?.value ||
                  allClients?.map((obj) => obj?.objectId),
              },
            }
          : formData
        : {
            ...formData,
            parentStatus: formData.parentStatus?.map(({ value }) => value),
            status: formData.status?.map(({ value }) => value),
            client: { value: activeAccountId },
          }
    );

    getTotalSRCount({
      variables: { subQuery },
    });

    getServiceRequests({
      variables: {
        subQuery,
        limit: layoutMode ? PAGE_SIZE : 100000,
        skip: layoutMode ? (pageNo - 1) * PAGE_SIZE : 0,
      },
    });
  }

  useEffect(() => {
    handleSearch(1);
  }, [activeAccountId]);

  useEffect(() => {
    if (!layoutMode) handleSearch(1);
  }, [layoutMode]);

  function handleClear() {
    if (query.size) navigate("/admin/service-requests", { replace: true });

    const client = isAdmin
      ? activeRole == ROLES.INSPACCO_KAM
        ? { value: allClients?.map((obj) => obj?.objectId) }
        : null
      : { value: activeAccountId };
    const subQuery = getServiceRequestsSubQuery({
      startDate: moment(formData.dateRange?.startDate).startOf("day").toDate(),
      endDate: moment(formData.dateRange?.endDate).endOf("day").toDate(),
      status: SERVICE_REQUEST_STATUS_OPTIONS.map(({ value }) => value),
      client: client
        ? Array.isArray(client?.value)
          ? client.value
          : [client?.value]
        : null,
    });
    getTotalSRCount({
      variables: { subQuery },
    });
    getServiceRequests({
      variables: { subQuery, limit: PAGE_SIZE, skip: 0 },
    });
    const initialFormData = {
      dateRange: {
        startDate: moment(new Date()).subtract(1, "month").toDate(),
        endDate: new Date(),
      },
      parentStatus: [],
      status: [],
      client: {
        label: activeSociety?.label,
        value: activeSociety?.objectId,
      },
    };
    setFormData(initialFormData);
    setAppliedFilters(initialFormData);
  }

  function syncServiceRequest(updateServiceRequestData) {
    if (selectedService) {
      setServiceRequests((prvServiceRequests) =>
        prvServiceRequests?.map((obj) => {
          if (
            obj?.node?.objectId ===
            (layoutMode == 1
              ? selectedService?.objectId
              : updateServiceRequestData?.objectId)
          ) {
            return {
              ...obj,
              node: { ...obj.node, ...updateServiceRequestData },
            };
          }
          return obj;
        })
      );
      // const modifiedServiceRequests = serviceRequests?.map((obj) => {
      //   if (obj?.node?.objectId === (layoutMode == 1? (selectedService?.objectId ):updateServiceRequestData?.objectId)) {
      //     return { ...obj, node: { ...obj.node, ...updateServiceRequestData } };
      //   }
      //   return obj;
      // });
      // setServiceRequests(modifiedServiceRequests);
      // console.log(
      //   "modifiedServiceRequests --- in admin service request sync fn",
      //   serviceRequests,
      //   modifiedServiceRequests
      // );
      setSelectedService((prevSelectedService) => ({
        ...prevSelectedService,
        ...updateServiceRequestData,
      }));
    }
  }

  async function getActivityHistory() {
    const res = await getServiceRequestActivityHistory({
      variables: {
        id: selectedService?.objectId,
      },
    });
    const obj = pickupDataFromResponse(res);
    syncServiceRequest(obj);
    console.log("activity History", obj);
  }

  // header actions update - needs to be moved to other place, like a util function
  async function handleUpdate(data) {
    // console.log("data", data);
    if (data?.comment) {
      const commentRes = await addServiceRequestComment({
        variables: {
          serviceRequestId: selectedService?.objectId,
          userId: user?.objectId,
          comment: data.comment,
        },
      });
      const updateServiceReqeustData =
        commentRes?.data?.updateServiceRequest?.serviceRequest;
      syncServiceRequest(updateServiceReqeustData);
      console.log("comment", commentRes);
      toast.success(`Comment Added successfully`);
    } else {
      const inputFields = {};
      fieldsUpdateArray?.forEach((field) => {
        if (data[field]) {
          inputFields[field] = data[field];
        }
      });
      const updateRes = await updateServiceRequest({
        variables: {
          ID: selectedService.id,
          fields: inputFields,
        },
      });
      console.log("updateRess", updateRes);

      toast.success(`Updation Successfull`);

      const updateServiceRequestData =
        updateRes?.data?.updateServiceRequest?.serviceRequest || {};
      if (data.status) setTimeout(getActivityHistory, 300);
      syncServiceRequest(updateServiceRequestData);
    }
  }

  const handleServiceSelection = (node) => setSelectedService(node);

  const filterServiceSubs = ({ text: filterStr }) => {
    return _textSearch({
      data: pickupDataFromResponse({ data: serviceRequestsData }),
      filters: ["displayId", "status", "requirement"],
      filterStr,
    }).map((obj) => ({ node: obj }));
  };

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

  const _setFormData = (obj) => {
    setFormData({
      ...formData,
      ...obj,
    });
  };

  const _handleFilterSectionChange = (event, key, obj) => {
    let action = event.target.checked ? "ADD" : "REMOVE";
    let finalFormDataKey =
      Array.isArray(formData[key]) && formData[key] ? formData[key] : [];
    if (action === "ADD") {
      setFormData({
        ...formData,
        [key]: [...finalFormDataKey, obj],
      });
    } else {
      setFormData({
        ...formData,
        [key]: finalFormDataKey?.filter(
          (formKey) => obj.value !== formKey?.value
        ),
        ...(key === "parentStatus" &&
          !_isEmpty(formData.parentStatus) && { status: [] }),
      });
    }
  };
  function TestError1() {
    const a=2;
    a.nono();
  }
  return (
    <>
      <div className="mt-3">
        <div className="flex justify-between pb-2">
        <TestError1/>
          <Breadcrumb
            className="self-center py-0"
            path={[{ route: "/", name: "Home" }, { name: "Service Requests" }]}
          />
          <div className="pl-3">
            <IconToggle
              toggleIcon1={<TableCellsIcon className="w-4 h-4" />}
              toggleIcon2={<ListBulletIcon className="w-4 h-4" />}
              {...{
                value: layoutMode,
                onChange: (mode) => setLayoutMode(mode),
              }}
            />
          </div>
          <div className="text-right ">
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
            <Button
              paddingClass="0"
              onClick={() => setShowCreateForm(true)}
              className="ml-2 gap-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create a Service Request
            </Button>
          </div>
        </div>
        <div className="flex items-center px-4 py-2 mb-2 rounded-lg bg-base-100">
          <div className="inline-flex w-1/12">
            <Button
              className="gap-2 text-sm font-medium capitalize btn-sm"
              onClick={() => setIsFilterSectionOpen(true)}
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
            </Button>
          </div>
          <div className="w-11/12 ml-4">
            {filterMode === "all" && (
              <FilterPillSection data={appliedFilters} />
            )}
          </div>
        </div>

        <div className="flex lg:flex-row md:flex-row sm:flex-col">
          <div className="w-full px-2 pt-4 bg-base-200">
            {/* {console.log()} */}
            <div className="rounded-xl-tl rounded-xl-bl">
              {layoutMode ? (
                <Drilldown
                  {...{
                    source: "sr",
                    showSearch: false,
                    leftSideLoading: srLoading,
                    pagination: true,
                    // showSearch: false,
                    onPageChange: setCurrentPage,
                    paginationConfig: {
                      current_page: currentPage,
                      showRecords: true,
                      total_pages: Math.ceil(
                        (srCountData?.serviceRequests?.count || PAGE_SIZE) /
                          PAGE_SIZE
                      ),
                    },
                    // rightSideLoading: serviceStaffLoading,
                    listData: serviceRequests,
                    listFilterFn: filterServiceSubs,
                    onItemSelect: (node) => {
                      handleServiceSelection(node);
                    },
                    details_header: (
                      <DetailsHeader
                        data={selectedService}
                        selectedServicePartners={selectedServicePartners}
                        onSubmit={handleUpdate}
                        icon={
                          <CalendarDaysIcon className="w-6 h-6 text-accent" />
                        }
                      />
                    ),
                    details_content: (
                      <DetailsAccordion
                        data={selectedService}
                        onCommentAdd={handleUpdate}
                        onOpenQuotationClick={handleOpenQuotation}
                        onCreateQuotationClick={toggleCreateQuotationModal}
                      />
                    ),
                  }}
                />
              ) : (
                <>
                  <ServiceRequestDataTable
                    {...{
                      data: { serviceRequests: { edges: serviceRequests } },
                      loading: srLoading,
                      openSRDetailsModal: (flag, currentSRData) => {
                        setShowSRDetailsModal(flag);
                        setSelectedService(currentSRData);
                      },
                      syncServiceRequest,
                    }}
                  />
                </>
              )}
              {showCreateForm ? (
                <Modal
                  title="Create New Service Request"
                  closeModal={toggleModal}
                  showModal={showCreateForm}
                  showBtns={false}
                  fullscreen={true}
                >
                  <CreateNewSRForm
                    {...{
                      societies: allClients,
                      services: allServices?.map((service) => {
                        return {
                          label: service.name,
                          value: service.objectId,
                        };
                      }),
                      isAdminPage: isAdmin,
                      selectedSociety: activeSociety,
                      onCloseCallback: () => {
                        setShowCreateForm(false);
                        window.location.reload();
                        // refetchServiceRequests();
                      },
                    }}
                  />
                </Modal>
              ) : null}
              {showSRDetailsModal ? (
                <Modal
                  title={`#SR ${selectedService.displayId} details`}
                  closeModal={() => setShowSRDetailsModal(false)}
                  showModal={showSRDetailsModal}
                  showBtns={false}
                  fullscreen={true}
                >
                  <Details
                    {...{
                      header: false,
                      details_content: (
                        <DetailsAccordion
                          noHeader
                          data={selectedService}
                          onCommentAdd={handleUpdate}
                          onOpenQuotationClick={handleOpenQuotation}
                          onCreateQuotationClick={toggleCreateQuotationModal}
                        />
                      ),
                      details_header: (
                        <DetailsHeader
                          selectedServicePartners={selectedServicePartners}
                          data={selectedService}
                          onSubmit={handleUpdate}
                          icon={
                            <CalendarDaysIcon className="w-6 h-6 text-accent" />
                          }
                        />
                      ),
                      // actionsComp,
                    }}
                  />
                </Modal>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
      {showCreateQuotationModal && (
        <Modal
          title={
            quotationReadOnlyMode
              ? `#Quotation ${selectedQuotation.index} details`
              : "Create New Quotation"
          }
          closeModal={toggleCreateQuotationModal}
          showModal={showCreateQuotationModal}
          showBtns={false}
          fullscreen={true}
        >
          <CreateQuotationModal
            onCloseCallback={toggleCreateQuotationModal}
            data={selectedService}
            selectedServicePartners={selectedServicePartners}
            readOnly={quotationReadOnlyMode}
            onSubmit={handleUpdate}
            selectedQuotation={selectedQuotation}
          />
        </Modal>
      )}
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
      <SideDrawer
        isOpen={isFiltersSectionOpen}
        className="!bg-base-100"
        setIsOpen={() => setIsFilterSectionOpen(!isFiltersSectionOpen)}
        width="w-80"
        height="h-full"
        placement="left"
      >
        <div className="flex items-center justify-center">
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
        <div className="menu-target">
          {/* {
                name: "displayId",
                label: "Service Request Number",
                value: formData.displayId,
                type: "NUMBER",
                setData: _setFormData,
              } */}
          {filterMode === "all" && (
            <div className="mt-4">
              <Accordion
                flush
                compact
                data={[
                  {
                    // icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
                    title: `Status`,
                    content: (
                      <div className="flex flex-col gap-1">
                        <div className="mt-1 mb-2">
                          <Input
                            value={statusSearchStr}
                            prefixIcon={
                              <MagnifyingGlassIcon className="w-4 h-4" />
                            }
                            className={"input input-sm"}
                            placeholder="Search Status"
                            onChange={({ target }) =>
                              setStatusSearchStr(target.value)
                            }
                          />
                        </div>
                        {Object.keys(
                          _.groupBy(SERVICE_REQUEST_STATUS_OPTIONS, "status")
                        )
                          ?.filter((key) =>
                            statusSearchStr
                              ? key
                                  .toLowerCase()
                                  .includes(statusSearchStr.toLowerCase())
                              : true
                          )
                          ?.map((key) => {
                            return (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-xs"
                                  onChange={(event) =>
                                    _handleFilterSectionChange(
                                      event,
                                      "parentStatus",
                                      { value: key, label: key }
                                    )
                                  }
                                  checked={formData.parentStatus?.some(
                                    ({ value }) => value == key
                                  )}
                                />
                                <Text className="text-sm">{key}</Text>
                              </div>
                            );
                          })}
                      </div>
                    ),
                  },
                  {
                    title: `Sub Status`,
                    content: (
                      <div className="flex flex-col gap-1">
                        <div className="mt-1 mb-2">
                          <Input
                            value={subStatusSearchStr}
                            disabled={!formData.parentStatus?.length}
                            prefixIcon={
                              <MagnifyingGlassIcon className="w-4 h-4" />
                            }
                            className={"input input-sm"}
                            placeholder="Search Sub Status"
                            onChange={({ target }) =>
                              setSubStatusSearchStr(target.value)
                            }
                          />
                        </div>
                        {(formData.parentStatus
                          ? SERVICE_REQUEST_STATUS_OPTIONS?.filter((a) =>
                              (Array.isArray(formData.parentStatus)
                                ? formData.parentStatus
                                : [formData.parentStatus]
                              )
                                ?.map(({ value }) => value)
                                .includes(a?.status)
                            )
                          : SERVICE_REQUEST_STATUS_OPTIONS
                        )
                          .filter(({ label, status }) =>
                            subStatusSearchStr
                              ? `${label} ${status}`
                                  .toLowerCase()
                                  .includes(subStatusSearchStr.toLowerCase())
                              : true
                          )
                          .map((statusObj) => {
                            return (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.status?.some(
                                    ({ value }) => value == statusObj.value
                                  )}
                                  onChange={(event) =>
                                    _handleFilterSectionChange(
                                      event,
                                      "status",
                                      statusObj
                                    )
                                  }
                                  className="checkbox checkbox-xs"
                                />
                                <Text className="text-sm">
                                  {statusObj.label}{" "}
                                  {formData.parentStatus?.length > 1 ? (
                                    <Badge
                                      className={`badge badge-sm`}
                                      color={statusObj.color}
                                      text={statusObj.status}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </Text>
                              </div>
                            );
                          })}
                      </div>
                    ),
                  },
                  {
                    // icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
                    title: `Priority`,
                    content: (
                      <div className="flex flex-col gap-1">
                        {priorityOptions.map((priorityObj) => {
                          return (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.priority?.some(
                                  (pr) => priorityObj?.value === pr?.value
                                )}
                                onChange={(event) =>
                                  _handleFilterSectionChange(
                                    event,
                                    "priority",
                                    priorityObj
                                  )
                                }
                                className="checkbox checkbox-xs"
                              />
                              <Text className="text-sm">
                                {priorityObj.label}
                              </Text>
                            </div>
                          );
                        })}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
          <FiltersBar
            layout="vertical"
            loading={srLoading}
            filters={[
              {
                name: "displayId",
                label: "Service Request Number",
                value: formData.displayId,
                type: "NUMBER",
                setData: _setFormData,
              },
              {
                label: "Date Range",
                name: "dateRange",
                type: "DATERANGE",
                value: formData.dateRange,
                setData: _setFormData,
              },
              // {
              //   label: "Status",
              //   name: "parentStatus",
              //   multiple: true,
              //   type: "SELECT",
              //   menuPortalTarget: portalTarget,
              //   native: false,
              //   value: formData.parentStatus,
              //   setData: _setFormData,
              //   options: Object.keys(
              //     _.groupBy(SERVICE_REQUEST_STATUS_OPTIONS, "status")
              //   )?.map((key) => {
              //     return {
              //       label: key,
              //       value: key,
              //     };
              //   }),
              // },
              // {
              //   label: "Sub Status",
              //   name: "status",
              //   multiple: true,
              //   type: "SELECT",
              //   menuPortalTarget: portalTarget,
              //   native: false,
              //   value: formData.status,
              //   setData: _setFormData,
              //   options: formData.parentStatus
              //     ? SERVICE_REQUEST_STATUS_OPTIONS?.filter(
              //         (a) => a?.status === formData?.parentStatus?.value
              //       )
              //     : SERVICE_REQUEST_STATUS_OPTIONS,
              // },
              {
                label: "Client",
                name: "client",
                type: "SELECT",
                menuPortalTarget: portalTarget,
                native: false,
                value: formData.client?.value ? formData.client : null,
                setData: _setFormData,
                options: allClients?.map((client) => {
                  return {
                    label: client?.name,
                    value: client?.objectId,
                  };
                }),
              },
              {
                label: "Service",
                name: "service",
                type: "SELECT",
                menuPortalTarget: portalTarget,
                native: false,
                value: formData.service || "",
                setData: _setFormData,
                options: allServices?.map((service) => {
                  return {
                    label: service?.name,
                    value: service?.objectId,
                  };
                }),
              },
              {
                label: "Sub Service",
                name: "subService",
                type: "SELECT",
                menuPortalTarget: portalTarget,
                native: false,
                value: formData.subService,
                setData: _setFormData,
                options: subServiceOptions,
              },
              // {
              //   label: "Priority",
              //   name: "priority",
              //   multiple: true,
              //   type: "SELECT",
              //   menuPortalTarget: portalTarget,
              //   native: false,
              //   value: formData.priority,
              //   setData: _setFormData,
              //   options: priorityOptions,
              // },
              {
                label: "Requester",
                name: "requester",
                type: "SELECT",
                menuPortalTarget: portalTarget,
                native: false,
                value: formData.requester || "",
                setData: _setFormData,
                options: societyMembers?.map((member) => {
                  return {
                    label:
                      member?.member?.firstName +
                      " " +
                      member?.member?.lastName,
                    value: member?.member?.objectId,
                  };
                }),
              },
            ]?.filter((obj) => {
              let include = true;
              if (filterMode == "single" && obj.name != "displayId") {
                include = false;
              }
              if (filterMode == "all" && obj.name == "displayId") {
                include = false;
              }
              if (!isAdmin && obj.name === "client") {
                include = false;
              }
              return include;
            })}
            onSubmit={() => handleSearch(1)}
            onClear={handleClear}
          />
        </div>
      </SideDrawer>
    </>
  );
};

export default AdminServiceRequests;
