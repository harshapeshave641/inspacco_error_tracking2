import React, { act, useEffect, useState } from "react";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowUpRightIcon from "@heroicons/react/24/outline/ArrowUpRightIcon";
import { useTranslation } from "react-i18next";

import DashboardTopBar from "../../components/common/Dashboard/DashboardTopBar";
import TitleCard from "../../components/common/Cards/TitleCard";
import Select from "../../components/common/neomorphic/Select";
import BarChart from "../../components/common/Charts/CommonCharts/BarChart";
import PieChart from "../../components/common/Charts/CommonCharts/PieChart";
//import DoughnutChart from "../../components/common/Charts/CommonCharts/DoughnutChart";
import DataGrid from "../../components/common/DataTable/DataGrid";
import apiEnv from "../../env";
import { useSelector } from "react-redux";
import { ROLES, SERVICE_REQUEST_PARENT_STATUS_COLORS } from "../../constants";

const columnsArr = [
  {
    headerName: "Sub-Status",
    field: "subStatus",
    cellRenderer: "hyperlinkCellRenderer",
  },
  { headerName: "Count", field: "count", type: "number" },
  { headerName: "Status", field: "status" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [dashboardDateRange, setDashboardDateRange] = useState({
    startDate: moment(new Date()).subtract(30, "days").toDate(),
    endDate: new Date(),
  });
  const [selectedServices, setSelectedServices] = useState(null);
  const [selectedClient,setSelectedClient] = useState(null)
  const [dashboardData, setDashboardData] = useState({});
  const {
    sessionToken,
    allServices = [],
    allClients=[],
    activeSociety,
    activeRole,
    isAdmin,
  } = useSelector((state) => state.authSlice);
  const { t } = useTranslation();
  const serviceOptions = [
    { label: "All", value: "all" },
    ...allServices?.map((service) => {
      return {
        label: service?.name,
        value: service?.objectId,
      };
    }),
  ];

  function getDashboardData() {
    setLoading(true);
    console.log("selectedServices", selectedServices);
    const payload = {
      dateAfter: moment(dashboardDateRange?.startDate)
        .startOf("date")
        .toDate()
        .getTime(),
      dateBefore: moment(dashboardDateRange?.endDate)
        .endOf("date")
        .toDate()
        .getTime(),
      clientIds: isAdmin ? (selectedClient?[selectedClient?.value]: (activeRole === ROLES.INSPACCO_KAM ?allClients?.map(obj=>obj.objectId) :null)) : [activeSociety?.objectId],
      serviceIds:
        selectedServices && selectedServices?.value !== "all"
          ? [selectedServices?.value]
          : null,
      graphTypes: [
        "service_substatus",
        "service_status",
        "completion_status",
        "count_by_service",
      ],
    };
    fetch(apiEnv.host + "/api/dashboard", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "X-Parse-Session-Token": sessionToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dasboard data", data);
        setDashboardData(data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    getDashboardData();
  }, [
    dashboardDateRange.startDate,
    dashboardDateRange.endDate,
    selectedServices,
    activeSociety?.objectId,
    selectedClient
  ]);
  const serviceData = {
    labels: dashboardData["count_by_service"]?.data?.map(
      (obj) => obj.serviceName
    ),
    datasets: [
      {
        label: "Services",
        data: dashboardData["count_by_service"]?.data?.map((obj) => obj?.count),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const statusData = {
    labels: dashboardData["service_status"]?.data?.map(
      (obj) => obj.serviceStatus
    ),
    datasets: [
      {
        label: "Services Status",
        data: dashboardData["service_status"]?.data?.map((obj) => obj?.count),
        backgroundColor: dashboardData["service_status"]?.data?.map(
          (obj) =>
            SERVICE_REQUEST_PARENT_STATUS_COLORS[obj.serviceStatus] || "yellow"
        ),
      },
    ],
  };

  const completionStatusData = {
    labels: dashboardData["completion_status"]?.data?.map(
      (obj) => obj.completionStatus
    ),
    datasets: [
      {
        label: "Completion Status",
        data: dashboardData["completion_status"]?.data?.map(
          (obj) => obj?.count
        ),
        backgroundColor: ["#ff8234", "#84cc16", "#fbbf24", "#00b090"],
      },
    ],
  };

  const subStatusData = dashboardData["service_substatus"]?.data?.map((obj) => {
    return {
      subStatusValue: obj.name,
      subStatus: obj.displayName,
      count: obj.count,
      status: obj.serviceStatus,
    };
  });
  // const zoneData = {
  //     labels: ["Central", "Eastern", "North-Eastern", "Northen", "Southern", "Western"],
  //     datasets: [{
  //         label: "Zone",
  //         data: [73, 27, 11, 32, 45, 43],
  //         backgroundColor: ["#84cc16", "#f97316", "#2563eb", "#ef4444", "#8b5cf6", "#4ade80"],
  //     }]
  // };

  const barChartOption = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
    },
  };

  const completionStatusHorizontalBarChart = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
    },
  };

  const pieChartOption = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // const doughnutChartOption = {
  //     maintainAspectRatio: false,
  //     responsive: true,
  //     plugins: {
  //         legend: {
  //             position: "top",
  //             display: true
  //         },
  //     },
  // };

  const updateDashboardPeriod = (date) => setDashboardDateRange(date);

  function onTaskClicked(serviceDetails) {
    let sDate = dashboardDateRange?.startDate;
    let eDate = dashboardDateRange?.endDate;
    if (typeof sDate != "object") {
      sDate = new Date(sDate);
    }
    if (typeof eDate != "object") {
      eDate = new Date(eDate);
    }
    //  return;
    let urlQuery = `${
      isAdmin ? "/admin" : ""
    }/service-requests?startDate=${sDate?.toISOString()}&endDate=${eDate?.toISOString()}`;
    if (
      selectedServices &&
      typeof selectedServices === "object" &&
      !Array.isArray(selectedServices)
    ) {
      urlQuery += `&serviceId=${selectedServices?.value}`;
    } else if (serviceDetails && serviceDetails?.chartType === "Service") {
      const service = allServices?.find(
        (service) => service.name === serviceDetails?.service
      );
      urlQuery += `&serviceId=${service?.objectId}`;
    }

    if (serviceDetails?.chartType === "Status") {
      urlQuery += `&status=${serviceDetails?.serviceStatus}`;
    }

    if (serviceDetails?.chartType === "Sub-Status") {
      urlQuery += `&status=${serviceDetails?.serviceStatus}&subStatus=${serviceDetails?.subStatus}`;
    }
    // isAdmin ? (selectedClient?[selectedClient?.value]: null) : [activeSociety?.objectId],
    if(isAdmin && selectedClient){
      urlQuery += `&clientId=${selectedClient?.value}`;
    }
    urlQuery += `&view=Table`;
    navigate(urlQuery);
  }

  function renderBarChart(options, data, chartName) {
    return (
      <BarChart
        options={options}
        data={data}
        barClick={(e) => onBarChartClick(e, chartName)}
      />
    );
  }

  function renderStatusChart(options, data) {
    return (
      <PieChart options={options} data={data} chartClick={onPieChartClick} />
    );
  }

  const onPieChartClick = (eventObj) => {
    const selectedDetails = {
      serviceStatus: statusData?.labels[eventObj?.index],
      chartType: "Status",
    };
    onTaskClicked(selectedDetails);
  };

  const onBarChartClick = (barClickObj, chartClicked) => {
    let serviceBarSelected = {};
    if (chartClicked === "Service") {
      serviceBarSelected = {
        service: serviceData?.labels[barClickObj?.index],
        chartType: "Service",
      };
      onTaskClicked(serviceBarSelected);
    }
  };

  const statStatus = [
    {
      label: "Quotation Approval Pending",
      value: "QUOTATION_APPROVAL_PENDING",
      hide: isAdmin ? true : false,
    },
    {
      label: "Payment Pending",
      value: "INVOICE_ATTACHED_PAYMENT_PENDING",
      hide: isAdmin ? true : false,
    },
    {
      label: "Quotation Approved, Work Pending",
      value: "QUOTATION_APPROVED",
      hide: isAdmin ? false : true,
    },
    {
      label: "Visit Done , Quote Pending",
      value: "VISIT_DONE_QUOTATION_PENDING",
      hide: isAdmin ? false : true,
    },
    {
      label: "To Be Assigned",
      value: "TO_BE_WORKED_UPON",
      hide: isAdmin ? false : true,
    },
  ];
  // function renderDoughnutChart(options, data) {
  //     return <DoughnutChart options={options} data={data} />
  // }

  function renderTable() {
    return (
      <>
        <DataGrid
          download={true}
          showManageColumns={false}
          name={"Substatus"}
          data={subStatusData}
          columnDefs={columnsArr.map((colDef) => {
            if (colDef.field === "subStatus") {
              return {
                ...colDef,
                cellRendererParams: {
                  onClick: ({ data }) => {
                    const clickedRow = {
                      serviceStatus: data?.status,
                      subStatus: data?.subStatus,
                      chartType: "Sub-Status",
                    };
                    onTaskClicked(clickedRow);
                  },
                },
              };
            }
            return colDef;
          })}
          style={{ height: `${window.innerHeight - 280}px` }}
        />
      </>
    );
  }
  function handleStatClick(data = {}) {
    const clickedRow = {
      serviceStatus: data?.status,
      subStatus: data?.subStatus,
      chartType: "Sub-Status",
    };
    onTaskClicked(clickedRow);
  }
  return (
    <div className="gap-6 p-4 flex flex-col">
      <div className="grid grid-cols-3">
        <div>
          <span className="mb-2 text-sm">{t("general.service")} </span>
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
       {isAdmin? <div>
          <span className="mb-2 text-sm">{t("general.client")} </span>
          <Select
            placeholder={"Client"}
            native={false}
            className={"w-1/2"}
            onChange={setSelectedClient}
            options={allClients?.map(client=>{
              return {value: client.objectId, label: client.name}
            })}
            value={
              !selectedClient
                ? serviceOptions.find((a) => a.value === "all")
                : selectedClient
            }
          />
        </div>:null}
        <div className="mt-4">
          <DashboardTopBar
            dateRange={dashboardDateRange}
            updateDashboardPeriod={updateDashboardPeriod}
            onRefreshDataClicked={getDashboardData}
          />
        </div>
      </div>
      <div>
        {statStatus?.map((statObj) => {
          return (
            <div className="stats shadow ml-5">
              <div
                key={statObj.label}
                className={`stat cursor-pointer ${
                  statObj.hide ? "hidden" : ""
                }`}
                onClick={() =>
                  handleStatClick(
                    subStatusData?.find(
                      (obj) => obj.subStatusValue === statObj?.value
                    )
                  )
                }
              >
                <div className="stat-title"></div>
                <div class="flex justify-center">
                  <div className="stat-value ">
                    {subStatusData?.find(
                      (obj) => obj.subStatusValue === statObj.value
                    )?.count || 0}
                  </div>
                </div>
                <div className="stat-title">{statObj.label}</div>
              </div>
            </div>
          );
        })}
       
      </div>

      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white border-t-transparent"></div>
        </div>
      ) : null}
      <div className={`grid grid-cols-2 gap-y-3 gap-x-6 `}>
        <TitleCard title="Completion Status" topMargin="mt-2">
          <div>
            {renderBarChart(
              completionStatusHorizontalBarChart,
              completionStatusData,
              "Completion Status"
            )}
          </div>
        </TitleCard>
        <TitleCard title="Service" topMargin="mt-2">
          <div>{renderBarChart(barChartOption, serviceData, "Service")}</div>
        </TitleCard>
        <TitleCard title="Service Status" topMargin="mt-2">
          <div>{renderStatusChart(pieChartOption, statusData)}</div>
        </TitleCard>
        <TitleCard title="Services SubStatus" topMargin="mt-2">
          <div>{renderTable()}</div>
        </TitleCard>
        {/* <TitleCard title="Zone" topMargin="mt-2">
                    <div>
                        {renderDoughnutChart(doughnutChartOption, zoneData)}
                    </div>
                </TitleCard> */}
      </div>
    </div>
  );
}
