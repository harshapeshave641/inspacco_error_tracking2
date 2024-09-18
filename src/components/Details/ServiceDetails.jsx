import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import Datepicker from "react-tailwindcss-datepicker";
import { isEmpty } from "lodash";

import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import PaperClipIcon from "@heroicons/react/24/outline/PaperClipIcon";
import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";

import Badge from "../common/Badge";
import Accordion from "../common/Accordion";
import EmptyData from "../common/EmptyData";
import FlatList from "../common/FlatList";
import Stat from "../common/Stat";
import Button from "../common/neomorphic/Button";
import Input from "../common/neomorphic/Input";
import Modal from "../common/Modal";
import StaffListItem from "../Staff/StaffListItem";
import SelectProfileImage from "../common/SelectProfileImage";
// import ServiceHeroImage from "./ServiceHeroImage";
import HoverIcon from "../common/HoverIcon";

import { _getStatusType } from "../../helpers/utils";
import { GET_SERVICE_STAFF_BY_SUBSCRIPTION_ID } from "../../graphql/queries/getServiceStaffBySubscription";
import { GET_PARTNER_ATTACHMENTS } from "../../graphql/queries/getPartnerAttachments";
import { GET_SERVICE_SUBSCRIPTION_SCHEDULES } from "../../graphql/queries/getServiceSubscriptionSchedules";
import { GET_TASKS } from "../../graphql/queries/getTasks";
import { GET_SOCIETY_KAM } from "../../graphql/queries/getSocietyKAM";
import { GET_PARTNER_STAFFS_SEARCH } from "../../graphql/queries/getPartnerStaffsByPartnerSearch";
import { CREATE_SERVICE_STAFF } from "../../graphql/mutations/serviceStaff/createServiceStaff";
import DocumentManager from "../common/DocumentManager";
import Comments from "../common/Comments";
import { ADD_SCHEDULE_VISIT_COMMENT } from "../../graphql/mutations/scheduleVisitComment/addScheduleVisitComment";
import { GET_SERVICE_SUBSCRIPTION } from "../../graphql/queries/getServiceSubscriptions";

const Skeleton = () => {
  return (
    <div role="status" class="animate-pulse">
      <div class="h-4 bg-base-300 rounded-full mb-4"></div>
      <div className="animate-pulse">
        <div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
        </div>
        <div>
          <div class="h-52 mt-8 bg-base-300 rounded mb-2.5"></div>
        </div>
      </div>
    </div>
  );
};

export default function ServiceDetails({

  selectedRecord,
  loading,
}) {
  let { activeAccountId } = useSelector((state) => state.authSlice);
  let [showAddServiceStaff, setShowAddServiceStaff] = useState(false);

  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [totalActiveServiceAttachments, setTotalActiveServiceAttachments] =
    useState(0);
  const [selectedServiceSchedule, setSelectedServiceSchedule] = useState({});
  const [showServiceScheduleModal, setShowServiceScheduleModal] =
    useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  // should I stay or should I go now? create a route for this or modal?
  // route -> common / clean / optimized
  // modal -> common but must be included in every comp / repetitive / optimized

  const [getServiceSubscriptionData, { data: serviceSubscriptionData }] =
    useLazyQuery(GET_SERVICE_SUBSCRIPTION, {
      variables: {
        id: selectedRecord?.objectId, //serviceSubscriptionId
      },
    });

  const [
    getServiceStaffData,
    {
      refetch: getServiceStaff,
      data: serviceStaffData,
      loading: serviceStaffLoading,
    },
  ] = useLazyQuery(GET_SERVICE_STAFF_BY_SUBSCRIPTION_ID, {
    fetchPolicy: "network-only",
    variables: {
      serviceSubscriptionId: selectedRecord?.objectId, //route.params.serviceStaffId
    },
  });

  const [
    getTasksData,
    { data: tasksData, loading: tasksLoading, refetch: getTasks },
  ] = useLazyQuery(GET_TASKS, {
    variables: {
      serviceSubscriptionId: selectedRecord?.objectId,
    },
  });

  const [
    getPartnerDocuments,
    { data: partnerAttachmentsData, loading: partnerAttachmentsLoading },
  ] = useLazyQuery(GET_PARTNER_ATTACHMENTS, {
    variables: {
      partnerId: serviceSubscriptionData?.serviceSubscription?.partner?.id,
      module: "Partner",
    },
  });

  const [
    getServiceSubsScheduleData,
    {
      data: serviceSubsScheduleData,
      loading: loadingServiceSubsSchedule,
      refetch: refetchVisitSchedules,
    },
  ] = useLazyQuery(GET_SERVICE_SUBSCRIPTION_SCHEDULES, {
    fetchPolicy: "network-only",
    variables: { serviceSubscriptionId: selectedRecord?.objectId },
    onCompleted: (data) => {
      const selectedScheduleVisit =
        data.serviceSubscriptionSchedules.edges.find(
          ({ node }) => node.objectId === selectedServiceSchedule.objectId
        );
      setSelectedServiceSchedule(selectedScheduleVisit.node);
    },
  });

  const [getSocietyKAM, { data: societyKAMData, loading: societyKAMLoading }] =
    useLazyQuery(GET_SOCIETY_KAM, {
      variables: { societyId: activeAccountId },
    });

  const [
    getPartnerStaff,
    { data: partnerStaffData, loading: partnerStaffLoading },
  ] = useLazyQuery(GET_PARTNER_STAFFS_SEARCH, {
    variables: {
      partnerId: selectedRecord?.partner?.objectId,
      term: "",
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (selectedRecord?.objectId) {
      getServiceSubscriptionData();
      getServiceStaffData();
      getServiceSubsScheduleData();
      getTasksData();
      getSocietyKAM();
      getPartnerStaff();
    }
  }, [selectedRecord?.objectId]);

  useEffect(() => {
    if (serviceSubscriptionData?.serviceSubscription?.id) getPartnerDocuments();
  }, [serviceSubscriptionData]);

  const handleAddServiceStaff = () => {
    setShowAddServiceStaff(!showAddServiceStaff);
    getServiceStaffData();
  };

  return (
    <div className="">
      <div className="">
        <div className="flex">
          <div className="text-lg font-semibold">
            {/* {header ? header : "Details"} */}
          </div>
        </div>
        {/* <ServiceHeroImage serviceName={selectedRecord.service.name} /> */}
        {!loading && !serviceSubscriptionData?.serviceSubscription?.id ? (
          <EmptyData />
        ) : (
          <div className="w-[98%] p-4 pt-2 mx-auto">
            <div>
              {!serviceSubscriptionData?.serviceSubscription?.id ? (
                <Skeleton />
              ) : (
                <div>
                  <div className="">
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center justify-center gap-2">
                        <div className="text-xl font-medium text-accent">
                          {
                            serviceSubscriptionData?.serviceSubscription
                              ?.service?.name
                          }
                        </div>
                        {selectedRecord.status && (
                          <Badge
                            text={selectedRecord.status}
                            color={_getStatusType(selectedRecord.status)}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold flex-end text-accent justify-self-end">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {serviceSubscriptionData?.serviceSubscription
                          ?.startDate &&
                          `${moment(
                            serviceSubscriptionData?.serviceSubscription
                              ?.startDate
                          ).format("DD MMM YYYY")} -
                              ${moment(
                                serviceSubscriptionData?.serviceSubscription
                                  ?.endDate
                              ).format("DD MMM YYYY")}`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-5 w-[70%]">
                      <div className="">
                        <label className="">
                          <span className="label-text">Partner</span>
                        </label>
                        <div className="text-sm font-medium">
                          {
                            serviceSubscriptionData?.serviceSubscription
                              ?.partner?.name
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 rounded">
                    <Accordion
                      data={[
                        {
                          icon: <PaperClipIcon className="w-4 h-4" />,
                          title: `Documents (${
                            totalActiveServiceAttachments || 0
                          })`,
                          content: (
                            <>
                              <DocumentManager
                                parentId={selectedRecord?.objectId}
                                module="ServiceSubscription"
                                onUploadDone={() => {}}
                                getAttachments={(totalAttachments) =>
                                  setTotalActiveServiceAttachments(
                                    totalAttachments?.length
                                  )
                                }
                                permissionGroupId={`PARTNER_${selectedRecord.partner.objectId}_SOCIETY_${selectedRecord.society.objectId}`}
                              />
                            </>
                          ),
                        },
                        {
                          icon: <CalendarDaysIcon className="w-4 h-4" />,
                          title: `serviceVisitSchedule (${
                            serviceSubsScheduleData
                              ?.serviceSubscriptionSchedules?.edges?.length || 0
                          })`,
                          content: (
                            <>
                              {serviceSubsScheduleData
                                ?.serviceSubscriptionSchedules?.edges
                                ?.length ? (
                                <FlatList
                                  data={
                                    serviceSubsScheduleData
                                      ?.serviceSubscriptionSchedules?.edges
                                  }
                                  renderItem={({
                                    item: {
                                      node,
                                      node: {
                                        date,
                                        status,
                                        serviceSubscription,
                                      },
                                    },
                                    index,
                                  }) => (
                                    <Stat
                                      innerClassName="py-3"
                                      onClick={() => {
                                        setSelectedServiceSchedule(node);
                                        setShowServiceScheduleModal(
                                          (prevState) => !prevState
                                        );
                                      }}
                                      className="w-full mb-1 transition-all duration-300 rounded-lg cursor-pointer hover:bg-base-300"
                                      title={`Service Visit #${index + 1}`}
                                      desc={
                                        <div className="flex justify-between">
                                          <div>
                                            <div className="text-sm font-medium">
                                              {serviceSubscription.service.name}
                                            </div>
                                            <div>
                                              {moment(date).format(
                                                "DD MMM YYYY"
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center">
                                            <HoverIcon
                                              // onClick={() => }
                                              icon={
                                                <PencilSquareIcon className="w-5 h-5" />
                                              }
                                            />
                                            <Badge color="warning">
                                              {status}
                                            </Badge>
                                          </div>
                                        </div>
                                      }
                                      // desc={desc}
                                    />
                                  )}
                                  // keyExtractor={(item, index) => index.toString()}
                                  // refreshing={loading}
                                />
                              ) : (
                                <EmptyData />
                              )}
                            </>
                          ),
                        },
                        {
                          icon: <UserIcon className="w-4 h-4" />,
                          title: `inspaccoKAM (${
                            societyKAMData?.societyKAM?.edges?.length || 0
                          })`,
                          content: societyKAMData?.societyKAM?.edges?.length ? (
                            <FlatList
                              data={societyKAMData?.societyKAM?.edges}
                              renderItem={({ item: { node } }) => (
                                <StaffListItem
                                  {...{
                                    image: node.profileImage,
                                    desc: node.type,
                                    firstName: node.member.firstName,
                                    lastName: node.member.lastName,
                                    mobileNumber: node.member.mobileNumber,
                                  }}
                                />
                              )}
                            />
                          ) : (
                            <EmptyData />
                          ),
                        },
                        {
                          icon: <UserGroupIcon className="w-4 h-4" />,
                          title: `Staff (${
                            serviceStaffData?.serviceStaffs?.edges?.length || 0
                          })`,
                          content: (
                            <div className="text-right">
                              <Button
                                type="accent"
                                className="btn-sm"
                                // onClick={onClickAddStaff}
                                onClick={handleAddServiceStaff}
                              >
                                <PlusCircleIcon className="w-4 h-4 mr-1" />
                                <span>Add Staff</span>
                              </Button>
                              {serviceStaffData?.serviceStaffs?.edges
                                ?.length ? (
                                <FlatList
                                  data={serviceStaffData?.serviceStaffs?.edges}
                                  renderItem={({ item: { node } }) => (
                                    <StaffListItem
                                      {...{
                                        onClick: () => {
                                          setShowStaffDetails(true);
                                          setCurrentStaff(node.staff);
                                        },
                                        image: node.staff.profileImage,
                                        desc: node.type,
                                        firstName: node.staff.firstName,
                                        lastName: node.staff.lastName,
                                        mobileNumber: node.staff.mobileNumber,
                                      }}
                                    />
                                  )}
                                />
                              ) : (
                                <EmptyData />
                              )}
                            </div>
                          ),
                        },
                        {
                          icon: (
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                          ),
                          title: `Tasks (${
                            tasksData?.serviceSubscription?.tasks?.edges
                              .length || 0
                          })`,
                          content: (
                            <>
                              {tasksData?.serviceSubscription?.tasks?.edges
                                .length ? (
                                <FlatList
                                  renderItem={({ item: { node } }) => (
                                    <Stat
                                      innerClassName="py-3"
                                      className="w-full mb-1 transition-all duration-300 rounded-lg cursor-pointer hover:bg-base-300"
                                      title={node.summary}
                                      icon={
                                        <ClipboardDocumentListIcon className="w-6 h-6" />
                                      }
                                      desc={
                                        <div className="flex justify-between">
                                          <div className="inline-flex items-center gap-1 font-medium">
                                            <ClockIcon className="w-4 h-4" />
                                            <label>Frequency</label>
                                            <Badge color="info">
                                              {node.frequency}
                                            </Badge>
                                          </div>
                                          <div className="inline-flex items-center gap-1 font-medium">
                                            <StarIcon className="w-4 h-4" />
                                            <label>Reward Points</label>
                                            <label className="text-base">
                                              {node.rewardPoints}
                                            </label>
                                          </div>
                                        </div>
                                      }
                                    />
                                  )}
                                  data={
                                    tasksData?.serviceSubscription?.tasks?.edges
                                  }
                                />
                              ) : (
                                <EmptyData />
                              )}
                            </>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        {showServiceScheduleModal && (
          <Modal
            title="Service Visit Schedule Details"
            closeModal={() =>
              setShowServiceScheduleModal((prevState) => !prevState)
            }
            showBtns={false}
            showModal={showServiceScheduleModal}
          >
            <ServiceVisitDetailsModal
              {...{ selectedServiceSchedule, refetchVisitSchedules }}
            />
          </Modal>
        )}
        {showStaffDetails && (
          <Modal
            showBtns={false}
            title="Staff Details"
            closeModal={() => setShowStaffDetails(false)}
            showModal={showStaffDetails}
          >
            <div className="mt-5">
              <div className="flex flex-col items-center w-full px-2 pt-2 text-center gap-y-4">
                <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
                  <SelectProfileImage
                    showEdit={false}
                    url={currentStaff?.profileImage}
                  />
                  <label className="py-2 text-lg font-medium label-text">
                    {currentStaff?.firstName} {currentStaff?.lastName}
                  </label>
                </div>
                <div className="w-full p-4 text-left">
                  <div className="py-2 font-medium text-left">
                    <label className="label-text text-md">First Name</label>
                    <label className="block text-lg label-text">
                      {currentStaff?.firstName}
                    </label>
                  </div>
                  <div className="py-2 font-medium text-left">
                    <label className="label-text text-md">Last Name</label>
                    <label className="block text-lg label-text">
                      {currentStaff?.lastName}
                    </label>
                  </div>
                  <div className="py-2 font-medium text-left">
                    <label className="label-text text-md">Mobile Number</label>
                    <label className="block text-lg label-text">
                      {currentStaff?.mobileNumber}
                    </label>
                  </div>
                  <div className="py-2 font-medium text-left">
                    <label className="label-text text-md">Address</label>
                    <label className="block text-lg label-text">-</label>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {showAddServiceStaff && (
          <Modal
            title="Add Service Staff"
            closeModal={handleAddServiceStaff}
            showModal={showAddServiceStaff}
            showBtns={false}
            fullscreen
          >
            <div className="mt-5">
              <AddServiceStaffForm
                addedServiceStaffs={serviceStaffData?.serviceStaffs?.edges}
                serviceSubscriptionData={serviceSubscriptionData}
                closeParentModal={handleAddServiceStaff}
                selectedService={selectedRecord}
                staffList={partnerStaffData?.partnerStaffs?.edges}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

const ServiceVisitDetailsModal = ({
  selectedServiceSchedule,
  refetchVisitSchedules,
}) => {
  const [totalAttachments, setTotalAttachments] = useState(0);

  const [
    addScheduleVisitComment,
    {
      loading: addScheduleVisitCommentLoading,
      error: addSchduleVisitCommentErrors,
      refetch,
    },
  ] = useMutation(ADD_SCHEDULE_VISIT_COMMENT);

  const _handleAddComment = async (comment, visitId) => {
    if (!comment.trim()) {
      toast.error("Please enter valid comment!");
      return false;
    }

    const addScheduleVisitCommentResponse = await addScheduleVisitComment({
      variables: { comment, visitId },
    });

    if (addSchduleVisitCommentErrors) {
      toast.error("Error adding comment! Try again!");
      return false;
    }

    if (addScheduleVisitCommentResponse.data?.errors?.length)
      toast.error(addScheduleVisitCommentResponse.data?.errors?.[0]?.message);
    else toast.success("Comment added successfully!");
  };

  const _sortByDates = (arr = []) =>
    arr?.sort(({ node: { updatedAt: a } }, { node: { updatedAt: b } }) =>
      moment(a).diff(moment(b))
    );

  return (
    <div className="mt-5">
      <div># Service Visit</div>
      <div className="text-lg font-medium text-accent">
        {selectedServiceSchedule?.serviceSubscription?.service?.name}
        <Badge text={selectedServiceSchedule.status} className={"ml-2"} />
      </div>
      <div className="pt-6 rounded">
        <Accordion
          data={[
            {
              icon: <PaperClipIcon className="w-4 h-4" />,
              title: `Attachments (${totalAttachments || 0})`,
              content: (
                <>
                  <DocumentManager
                    parentId={selectedServiceSchedule?.objectId}
                    module="SubscriptionSchedule"
                    onUploadDone={() => {}}
                    getAttachments={(totalAttachments=[]) =>
                      setTotalAttachments(totalAttachments?.length)
                    }
                    permissionGroupId={`SUBSCRIPTION_SCHEDULE_${selectedServiceSchedule?.objectId}`}
                  />
                </>
              ),
            },
            {
              icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
              title: `Comments (${
                selectedServiceSchedule?.comments?.edges?.length || 0
              })`,
              content: (
                <Comments
                  edit={true}
                  loading={addScheduleVisitCommentLoading}
                  onSubmit={(comment) => {
                    _handleAddComment(
                      comment,
                      selectedServiceSchedule.objectId
                    );
                    refetchVisitSchedules();
                  }}
                  comments={_sortByDates(
                    selectedServiceSchedule?.comments?.edges
                  )}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

const AddServiceStaffForm = ({
  addedServiceStaffs = [],
  staffList,
  selectedService,
  closeParentModal,
  serviceSubscriptionData,
}) => {
  const [filteredStaffList, setFilteredPartnersList] = useState(null);
  const [partnerFilterText, setPartnerFilterText] = useState("");
  const [showSelectStaff, setShowSelectStaff] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [data, setFormData] = useState({});

  const [
    createServiceStaff,
    { loading: createServiceStaffLoading, error: createServiceStaffErrors },
  ] = useMutation(CREATE_SERVICE_STAFF);

  const startDateRange = {
    startDate: new Date(selectedService.startDate),
    endDate: new Date(selectedService.endDate),
  };
  const endDateRange = {
    startDate: new Date(selectedService.endDate),
    endDate: new Date(selectedService.endDate),
  };

  const onStaffFilterChange = ({ target: { value } }) => {
    setPartnerFilterText(value);
    const filteredStaffList = staffList.filter(
      ({ node: { firstName, lastName } }) =>
        `${firstName} ${lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPartnersList(filteredStaffList);
  };

  const _handleAddStaffToService = async () => {
    const serviceStaffInputData = {
      staff: currentStaff.objectId,
      type: data.type,
      startDate: moment(selectedService.startDate).startOf("day").toDate(),
      endDate: moment(selectedService.endDate).endOf("day").toDate(),
      status: currentStaff.status,
      serviceSubscription:
        serviceSubscriptionData?.serviceSubscription?.objectId,
    };

    const createPartnerStarffResponse = await createServiceStaff({
      variables: serviceStaffInputData,
    });

    performCleanup();

    if (createServiceStaffErrors) {
      toast.error("error");
    }

    if (createPartnerStarffResponse.data?.errors?.length)
      toast.error(createPartnerStarffResponse.data?.errors?.[0]?.message);
    else toast.success("Service staff added successfully!");
  };

  const performCleanup = () => {
    setCurrentStaff({});
    setFormData({});
    setPartnerFilterText("");
    closeParentModal();
  };

  const selectStaffForService = (staff) => {
    setCurrentStaff(staff);
    setShowSelectStaff(false);
  };

  const isStaffAdded = (node) => {
    return addedServiceStaffs?.find(
      ({ node: { staff } }) =>
        node.objectId === staff.objectId && node.firstName === staff.firstName
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pt-2 mx-6 text-center gap-y-4">
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={
              !isEmpty(currentStaff)
                ? `${currentStaff?.firstName} ${currentStaff?.lastName}`
                : ""
            }
            onFocus={() => setShowSelectStaff(true)}
            placeholder="Select Staff"
            className="w-full h-12 input input-md input-bordered"
            readOnly
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Input
            type="text"
            value={data.type}
            onChange={({ target: { value } }) =>
              setFormData({ ...data, type: value })
            }
            placeholder="Type"
            className="w-full h-12 input input-md input-bordered"
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Datepicker
            asSingle={true}
            useRange={false}
            containerClassName=""
            value={startDateRange}
            showShortcuts={false}
            theme={"light"}
            inputClassName="text-base-content input input-bordered w-full"
            disabled
            primaryColor={"white"}
          />
        </div>
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <Datepicker
            asSingle={true}
            useRange={false}
            containerClassName=""
            value={endDateRange}
            showShortcuts={false}
            theme={"light"}
            inputClassName="text-base-content input input-bordered w-full"
            disabled
            primaryColor={"white"}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="accent"
          loading={createServiceStaffLoading}
          disabled={!currentStaff?.objectId || !data.type}
          onClick={_handleAddStaffToService}
        >
          Add Staff to Service
        </Button>
        <Button onClick={performCleanup}>Close</Button>
      </div>
      <Modal
        fullscreen
        title="Select Staff"
        showModal={showSelectStaff}
        closeModal={() => setShowSelectStaff(false)}
        showBtns={false}
      >
        <div className="mt-5">
          <Input
            value={partnerFilterText}
            onChange={onStaffFilterChange}
            prefixIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
            className={"w-full"}
            iconWrapperClass={"top-4"}
            placeholder="Search"
          />
          <FlatList
            data={filteredStaffList || staffList}
            renderItem={({ item: { node } }) => (
              <StaffListItem
                {...{
                  disabled: isStaffAdded(node),
                  onClick: () => selectStaffForService(node),
                  image: node.profileImage,
                  desc: node.type,
                  firstName: node.firstName,
                  lastName: node.lastName,
                  mobileNumber: node.mobileNumber,
                }}
              />
            )}
          />
        </div>
      </Modal>
    </>
  );
};
