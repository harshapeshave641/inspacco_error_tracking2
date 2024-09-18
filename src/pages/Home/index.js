import React, { useState, useEffect } from "react";
import { NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import moment from "moment";
import { clone, isEmpty, orderBy } from "lodash";

import { GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE } from "./../../graphql/queries/getSocietyLevelStaffForDateRange";
import { GET_SOCIETY_LEVEL_INCIDENTS_FOR_DASHBOARD } from "./../../graphql/queries/getSocietyLevelIncidentsForDashboard";
import { GET_ATTENDANCE_FOR_DATE } from "./../../graphql/queries/getAttendanceForDate";
import { GET_TASKS_BY_SOCIETY } from "./../../graphql/queries/getTasksBySociety";

import { IncidentStatus } from "./../../models/Incident";

import DoughnutChart from "../../components/common/Charts/DoughnutChart";
import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
// import DashboardStats from "../../components/common/Dashboard/DashboardStats";
import TitleCard from "../../components/common/Cards/TitleCard";

import { populateNestedRecords } from "../../helpers/utils";
import Progress from "../../components/common/Progress";
import Select from "../../components/common/neomorphic/Select";
import ServiceRequestsBarChart from "../../components/common/Charts/BarChart";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/neomorphic/Button";
import ArrowUpRightIcon from "@heroicons/react/24/outline/ArrowUpRightIcon";
import { useTranslation } from "react-i18next";
const StatusMap = {
  [IncidentStatus.OPEN]: 1,
  [IncidentStatus.IN_PROGRESS]: 1,
  [IncidentStatus.RESOLVED]: 2,
};

const targetedServices = [
  "Housekeeping",
  "Security",
  "Gardening",
  "Society Manager",
  "Plumber",
  "Electrician",
  "MST",
  "Accountant",
];

const colorCode = [
  "#0A80EC",
  "#23D0DC",
  "#F4642C",
  "#0A80EC",
  "#23D0DC",
  "#F4642C",
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let {
    activeAccountId,
    activeSociety,
    activeServices = [],
  } = useSelector((state) => state.authSlice);

  activeSociety = clone(activeSociety || {});

  const [dashboardDateRange, setDashboardDateRange] = useState({
    startDate: moment(new Date()).subtract(8, "days").toDate(),
    endDate: new Date(),
  });
  // const [activeSubs, setActiveServiceSubs] = useState(0);
  const [selectedServices, setSelectedServices] = useState(null);

  const complaintData = [
    {
      label: "Open",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#0A80EC",
    },
    {
      label: "Inprogress",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#23D0DC",
    },
    {
      label: "Resolved",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#40bf80",
    },
  ];

  const tasksData = [
    {
      label: "Open",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#0A80EC",
    },
    {
      label: "Inprogress",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#23D0DC",
    },
    {
      label: "Completed",
      progress: 0,
      actualCount: 0,
      totalCount: 0,
      colorCode: "#40bf80",
    },
  ];

  const activeServicesOptions = activeServices?.map((serviceSubscription) => {
    return {
      label: serviceSubscription?.service?.name,
      value: serviceSubscription?.objectId,
      service: serviceSubscription?.service,
      society: serviceSubscription?.society,
      partner: serviceSubscription?.partner,
    };
  });
  console.log('selectedServices', selectedServices)
  const serviceSubscriptionIds = selectedServices
    ? Array.isArray(selectedServices)
      ? selectedServices?.map((a) => a.value)
      : selectedServices?.value === "all"
        ? activeServicesOptions?.map((a) => a.value)
        : [selectedServices.value]
    : [];

  const { data: incidentData, refetch: refetchIncidentData } = useQuery(
    GET_SOCIETY_LEVEL_INCIDENTS_FOR_DASHBOARD,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        serviceSubscriptionIds,
        societyId: activeAccountId,
        startDate: moment(dashboardDateRange.startDate)
          .startOf("date")
          .toDate(),
        endDate: moment(dashboardDateRange.endDate).endOf("date").toDate(),
        status: [
          IncidentStatus.OPEN,
          IncidentStatus.IN_PROGRESS,
          IncidentStatus.RESOLVED,
        ],
      },
    }
  );

  const [
    getTasksBySociety,
    {
      data: tasksByRange,
      loading: tasksLoading,
      refetch: refetchTasksBySociety,
    },
  ] = useLazyQuery(GET_TASKS_BY_SOCIETY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      serviceSubscriptionIds,
      startDate: moment(dashboardDateRange.startDate).startOf("date").toDate(),
      endDate: moment(dashboardDateRange.endDate).endOf("date").toDate(),
    },
    skip: !selectedServices?.length,
  });

  const [
    getServiceStaff,
    {
      data: serviceStaffData,
      refetch: refetchServiceStaff,
      networkStatus: getServiceStaffNetworkStatus,
    },
  ] = useLazyQuery(GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE, {
    variables: {
      societyId: activeAccountId,
      startDate: moment(dashboardDateRange.startDate).startOf("date").toDate(),
      endDate: moment(dashboardDateRange.endDate).endOf("date").toDate(),
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const getProgressPercentage = (actualCount, totalCount) => {
    if (totalCount === 0) {
      return 0;
    } else {
      return (actualCount / totalCount) * 100;
    }
  };

  useEffect(() => {
    getServiceStaff();
  }, [activeAccountId]);

  useEffect(() => {
    if (selectedServices?.length) {
      getTasksBySociety();
    }
  }, [selectedServices]);

  useEffect(() => {
    setSelectedServices([
      { label: "All", value: "all" },
      ...activeServices?.map((a) => {
        return {
          label: a?.service?.name,
          value: a?.objectId,
          society: a?.society,
          partner: a?.partner,
        };
      }),
    ]);
  }, [activeServices]);

  let incidents = {};
  let tasks = {};

  if (incidentData && incidentData?.incidents?.edges.length > 0) {
    incidents = orderBy(
      incidentData.incidents.edges,
      [({ node }) => StatusMap[node.status]],
      ["asc"]
    );
    const complaintDetails = {
      totalOpen: 0,
      totalInprogress: 0,
      totalResolved: 0,
    };
    incidents.map((item) => {
      if (item.node.status === "OPEN") {
        complaintDetails.totalOpen += 1;
      } else if (item.node.status === "IN_PROGRESS") {
        complaintDetails.totalInprogress += 1;
      } else {
        complaintDetails.totalResolved += 1;
      }
    });
    complaintData.map((complaintItem) => {
      complaintItem.totalCount = incidents.length;
      if (complaintItem.label === "Open") {
        complaintItem.actualCount = complaintDetails.totalOpen;
        complaintItem.progress = getProgressPercentage(
          complaintDetails.totalOpen,
          incidents.length
        );
      } else if (complaintItem.label === "Inprogress") {
        complaintItem.actualCount = complaintDetails.totalInprogress;
        complaintItem.progress = getProgressPercentage(
          complaintDetails.totalInprogress,
          incidents.length
        );
      } else {
        complaintItem.actualCount = complaintDetails.totalResolved;
        complaintItem.progress = getProgressPercentage(
          complaintDetails.totalResolved,
          incidents.length
        );
      }
    });
  }

  if (tasksByRange && tasksByRange?.taskActivities?.edges.length > 0) {
    tasks = orderBy(
      tasksByRange.taskActivities.edges,
      [({ node }) => StatusMap[node.status]],
      ["asc"]
    );
    const tasksDetails = {
      totalOpen: 0,
      totalInprogress: 0,
      totalResolved: 0,
    };
    tasks = populateNestedRecords(tasks, "task");
    tasks.map((item) => {
      if (item.node.taskStatus === "OPEN") {
        tasksDetails.totalOpen += 1;
      } else if (item.node.taskStatus === "IN_PROGRESS") {
        tasksDetails.totalInprogress += 1;
      } else {
        tasksDetails.totalResolved += 1;
      }
    });

    tasksData.map((taskItem) => {
      taskItem.totalCount = tasks.length;
      if (taskItem.label === "Open") {
        taskItem.actualCount = tasksDetails.totalOpen;
        taskItem.progress = getProgressPercentage(
          tasksDetails.totalOpen,
          tasks.length
        );
      } else if (taskItem.label === "Inprogress") {
        taskItem.actualCount = tasksDetails.totalInprogress;
        taskItem.progress = getProgressPercentage(
          tasksDetails.totalInprogress,
          tasks.length
        );
      } else {
        taskItem.actualCount = tasksDetails.totalResolved;
        taskItem.progress = getProgressPercentage(
          tasksDetails.totalResolved,
          tasks.length
        );
      }
    });
  }

  // const refreshDataClicked = () => {
  //   refetchIncidentData();
  //   refetchTasksBySociety();
  //   refetchServiceStaff();
  // };

  const updateDashboardPeriod = (date) => setDashboardDateRange(date);

  const serviceOptions = [
    { label: "All", value: "all" },
    ...activeServicesOptions,
  ];
  function onTaskClicked(rType = 'Task') {
    console.log('item', dashboardDateRange)
    let sDate = dashboardDateRange?.startDate;
    let eDate = dashboardDateRange?.endDate;
    if(typeof sDate != 'object'){
      sDate = new Date(sDate)
    }
    if(typeof eDate != 'object'){
      eDate = new Date(eDate)
    }
    //  return;
    let urlQuery = `/reports?rType=${rType}&startDate=${sDate?.toISOString()}&endDate=${eDate?.toISOString()}`
    if (typeof selectedServices === 'object' && !Array.isArray(selectedServices)) {
      urlQuery += `&serviceId=${selectedServices?.service?.objectId}`
    } else {
      urlQuery += `&serviceId=all`
    }
    navigate(urlQuery)
  }
  return (
    <div className="gap-6 p-4 flex flex-col">
      <div className="grid grid-cols-2">
        <div>
          <span className="mb-2 text-sm">{t('general.service')} </span>
          <Select
            placeholder={"Service"}
            native={false}
            className={"w-1/2"}
            onChange={setSelectedServices}
            options={serviceOptions}
            value={
              !selectedServices
                ? serviceOptions.find((a) => a.value === "all")
                : selectedServices
            }
          />
        </div>
        <div className="mt-4">
          <DashboardTopBar
            dateRange={dashboardDateRange}
            updateDashboardPeriod={updateDashboardPeriod}
          // onRefreshDataClicked={refreshDataClicked}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
        <TitleCard title={ t('menu.tasks')} topMargin="mt-2" TopSideButtons={<div>

          <ArrowUpRightIcon
            style={{
              width: 20,
              cursor: 'pointer'
            }}
            onClick={e => onTaskClicked('Task')}
          />
        </div>}>
          <div>
            {tasksData.map((item, index) => (
              <div className="my-4" key={index}>
                <div className="flex justify-between">
                  <div>{item.label}</div>
                  <div>
                    {item.actualCount}/{item.totalCount}
                  </div>
                </div>
                <Progress progress={item.progress} index={index} />
              </div>
            ))}
          </div>
        </TitleCard>
        <TitleCard title={ t('menu.attendance')} topMargin="mt-2" TopSideButtons={<div>

          <ArrowUpRightIcon
            style={{
              width: 20,
              cursor: 'pointer'
            }}
            onClick={e => onTaskClicked('Attendance')}
          />
        </div>}>
          <DoughnutChart
            startDate={dashboardDateRange.startDate}
            endDate={dashboardDateRange.endDate}
            societyIds={[activeAccountId]}
            serviceSubscriptionIds={serviceSubscriptionIds}
          />
        </TitleCard>
        <TitleCard title={t('menu.complaints')} topMargin="mt-2" TopSideButtons={<div>

          <ArrowUpRightIcon
            style={{
              width: 20,
              cursor: 'pointer'
            }}
            title="View Reports"
            onClick={e => onTaskClicked('Complaint')}
          />
        </div>}>
          {!isEmpty(complaintData) && (
            <div>
              {complaintData.map((item, index) => (
                <div className="my-4" key={index}>
                  <div className="flex justify-between">
                    <div>{item.label}</div>
                    <div>
                      {item.actualCount}/{item.totalCount}
                    </div>
                  </div>
                  <Progress progress={item.progress} index={index} />
                </div>
              ))}
            </div>
          )}
        </TitleCard>
        <TitleCard title={t('menu.serviceRequest')} topMargin="mt-2">
          <ServiceRequestsBarChart
            startDate={dashboardDateRange.startDate}
            endDate={dashboardDateRange.endDate}
            societyIds={[activeAccountId]}
            selectedServices={
              selectedServices?.value === "all"
                ? activeServicesOptions
                : [selectedServices]
            }
          />
        </TitleCard>
      </div>
    </div>
  );
}
