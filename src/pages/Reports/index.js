import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import moment from "moment";
import Datepicker from "react-tailwindcss-datepicker";

import CloudArrowDownIcon from "@heroicons/react/24/outline/CloudArrowDownIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
// import View from "../../../src/assets/svg/view.svg";
// import Download from "../../../src/assets/svg/Download-arrow.svg";

import env from "../../env";
import { downloadFileFromUrl, handleDownload } from "../../helpers/utils";

import { GENERATE_TASK_REPORT } from "../../graphql/mutations/generateReport/generateTaskReport";
import { GENERATE_COMPLAINT_REPORT } from "../../graphql/mutations/generateReport/generateComplaintReport";
import { GENERATE_ATTENDANCE_REPORT } from "../../graphql/mutations/generateReport/generateAttendanceReport";

import DataGrid from "../../components/common/DataTable/DataGrid";
import Select from "../../components/common/neomorphic/Select";
import Modal from "../../components/common/Modal";

import TaskActivityDetails from "../Tasks/TaskActivityDetails";
import { TaskStatus } from "../../constants";
import Button from "../../components/common/neomorphic/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiEnv from "../../env";

const complaintColumnDefs = [
  { headerName: "COMPLAINT ID", field: "displayId" },
  { headerName: "SITE NAME", field: "societyName" },
  { headerName: "SERVICE NAME", field: "name" },
  { headerName: "CREATED BY", field: "createdBy" },
  { headerName: "ASSIGNED TO", field: "assignedTo" },
  { headerName: "SUMMARY", field: "summary" },
  { headerName: "PRIORITY", field: "priority" },
  {
    headerName: "RAISED ON",
    field: "createdAt",
    type: "date",
  },
  { headerName: "STATUS", field: "status" },
  { headerName: "STATUS CHANGED BY", field: "statusChangedBy" },
  {
    headerName: "STATUS CHANGED ON",
    field: "statusChangedOn",
    type: "datetime",
  },
  { headerName: "Resolved Date", field: "resolvedDate" },
  { headerName: "CATEGORY", field: "category" },
  { headerName: "Comment", field: "comment" },
];
function attachmentCellRenderer(params) {
  console.log("params value", params.value);
  if (!params.value) {
    return null;
  }
  return (
    <div>
      {params.value
        ?.trim()
        ?.split(",")
        .map((link, index) => (
          <span style={{ color: "blue" }}>
            <a href={link} target="_blank">
              file{index + 1}
            </a>
            &nbsp;&nbsp;
          </span>
        ))}
    </div>
  );
}

const taskColumnDefs = [
  {
    headerName: "SUMMARY",
    field: "taskName",
    cellRenderer: "hyperlinkCellRenderer",
  },
  { headerName: "FACILITY", field: "societyName" },
  { headerName: "SERVICE NAME", field: "serviceName" },
  { headerName: "STATUS", field: "status" },
  {
    headerName: "START DATE",
    field: "startDate",
    type: "date",
  },
  {
    headerName: "END DATE",
    field: "endDate",
    type: "date",
  },
  { headerName: "COMMENT", field: "comment" },
  { headerName: "STATUS CHANGED BY", field: "statusChangedBy" },
  {
    headerName: "STATUS CHANGED ON",
    field: "statusChangedOn",
    type: "datetime",
  },
  { headerName: "CREATED BY", field: "createdBy" },
  { headerName: "FREQUENCY", field: "frequency" },
  { headerName: "CATEGORY", field: "category" },
  {
    headerName: "Attachment",
    field: "url",
    cellRenderer: attachmentCellRenderer,
  },
];
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function getColumnDefs(reportType, data = []) {
  if (reportType === "Task") {
    return taskColumnDefs;
  } else if (reportType === "Complaint") {
    return complaintColumnDefs;
  } else if (reportType === "Service Request") {
    return Object.keys(data?.[0] || {}).map((key) => {
      return { field: key, headerName: key?.toUpperCase() }
    })
  }
}
const Reports = () => {
  const query = useQuery();
  console.log('startDate', query.get('startDate'))
  console.log('endDate', query.get('endDate'))

  const [dateRange, setDateRange] = useState({
    startDate: query.get('startDate') ? moment(query.get('startDate')) : "",
    endDate: query.get('endDate') ? moment(query.get('endDate')) : ""
  });
  const [startDate, setStartDate] = useState(query.get('startDate') ? moment(query.get('startDate')) : "",);
  const [endDate, setEndDate] = useState(query.get('endDate') ? moment(query.get('endDate')) : "");
  const [reportType, setReportType] = useState(query.get('rType') || "Task");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicesData, setServicesData] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null)

  const [callTaskReportFunction] = useMutation(GENERATE_TASK_REPORT);
  const [callComplaintReportFunction] = useMutation(GENERATE_COMPLAINT_REPORT);
  // const [serviceOptions,setServiceOptions] = useState([])
  const [callAttendanceReportFunction] = useMutation(
    GENERATE_ATTENDANCE_REPORT
  );
  const [data, setData] = useState([]);
  const { isAdmin, activeAccountId, activeServices = [], sessionToken, allClients } = useSelector(
    (state) => state.authSlice
  );

  const tempSelectService = query.get('serviceId') ? (query?.get('serviceId') == 'all' ? activeServices?.map((obj) => {
    return {
      label: obj?.service?.name,
      value: obj?.service?.objectId,
    };
  }) : [{ value: query.get('serviceId') }]) : []

  const [selectedService, setSelectedService] = useState(tempSelectService);
  function handleDatePickerValueChange(obj) {
    setDateRange(obj);
    setStartDate(obj.startDate);
    setEndDate(obj.endDate);
  }
  function handleClickTaskSummary(props) {
    console.log("handleClickTaskSummary", props);
    setSelectedRecord(props.data);
    setIsModalOpen(true);
  }
  const modifiedTaskColumnDefs = taskColumnDefs.map((obj) => {
    if (obj.field === "taskName") {
      return {
        ...obj,
        cellRendererParams: {
          onClick: handleClickTaskSummary,
        },
      };
    }
    return obj;
  });
  console.log("activeServices", activeServices);

  useEffect(() => {
    setSelectedService([]);
  }, [activeAccountId]);

  const handleReportTypeChange = (v) => {
    console.log("value", v);
    setData([]);
    setReportType(v);
  };
  console.log('selectedServices', selectedService)

  const handleDownloadClick = async (reportOutput = "file") => {
    console.log("reportOutputFunciton", reportOutput);
    console.log("reportType", reportType);
    const societyId = activeAccountId;
    setLoading(true);
    try {
      // const societyIds = selectedSocieties.map((society) => society.value);
      console.log("societyId=>", societyId);
      console.log("selectedService", selectedService);
      const momentStartDate = moment(startDate).startOf("day").toDate();
      const momentEndDate = moment(endDate).endOf("day").toDate();
      let res = null;
      if (reportType === "Task") {
        res = await callTaskReportFunction({
          variables: {
            params: {
              societyId: societyId,
              serviceId: Array.isArray(selectedService)
                ? selectedService.map((v) => v?.value)
                : selectedService?.value,
              status: "Active",
              startDate: momentStartDate,
              endDate: momentEndDate,
              recordCount: 5000,
              reportOutput,
            },
          },
        }); // Handle the response
      } else if (reportType === "Complaint") {
        res = await callComplaintReportFunction({
          variables: {
            params: {
              societyId,
              serviceId: Array.isArray(selectedService)
                ? selectedService.map((v) => v?.value)
                : selectedService?.value,
              startDate: momentStartDate,
              endDate: momentEndDate,
              status: ["OPEN", "IN_PROGESS", "RESOLVED"],
              recordCount: 5000,
              reportOutput,
            },
          },
        });
      } else if (reportType == 'Service Request') {
        const payload = {
          "dateAfter": momentStartDate,
          "dateBefore": momentEndDate,
          "clientIds": [
            isAdmin?selectedClient?.value:societyId
          ],
          "format": reportOutput == "file" ? "xls" : "json"
        }
        async function handleJSON(res) {
          const data = await res.json()
          console.log('data', data)
          setData(data)
        }
        const fileName = `${reportType}_Report_${moment(startDate).format(
          "YYYY-MM-DD"
        )}_${moment(endDate).format("YYYY-MM-DD")}.xlsx`
        // const handleFileResponse = handleDownload(fileName)
        fetch(apiEnv.host + "/api/reports", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "X-Parse-Session-Token": sessionToken,
            "Content-Type": "application/json",
            "X-Parse-Application-Id": "inspacco-parse-server"
          },
        })
          .then(reportOutput == 'file' ? (res)=>handleDownload(res,fileName) : handleJSON)

        return;
      } else {
        res = await callAttendanceReportFunction({
          variables: {
            params: {
              societyId,
              startDate: moment(startDate).toDate(),
              endDate: moment(endDate).toDate(),
              recordCount: 50000,
              source: 'web'
            },
          },
        });
      }
      if (!res) {
        console.error("Something went wrong");
      }
      if (reportOutput === "file") {
        const reportUrl = res?.data?.callCloudCode?.result;

        const finalDownloadUrl = `${env.serverURL}${reportUrl.substring(
          reportUrl.indexOf("/files")
        )}`;
        downloadFileFromUrl(
          finalDownloadUrl,
          `${reportType}_Report_${moment(startDate).format(
            "YYYY-MM-DD"
          )}_${moment(endDate).format("YYYY-MM-DD")}.xlsx`
        );
      } else {
        console.log("data", res?.data?.callCloudCode?.result);
        if (reportType == "Task") {
          const result = res?.data?.callCloudCode?.result || [];
          setData(
            result.map((obj) => {
              return {
                ...obj,
                status:
                  TaskStatus[
                  obj.status?.toLowerCase() === "resolved"
                    ? "COMPLETED"
                    : obj.status
                  ],
              };
            })
          );
        } else {
          setData(res?.data?.callCloudCode?.result);
        }
      }
    } catch (error) {
      // Handle the error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // let serviceOptions = [];
  // console.log("services", servicesData);
  // if (servicesData && servicesData) {
  //   serviceOptions =
  //     pickupDataFromResponse(servicesData)?.map((serviceSubscription) => ({
  //       value: serviceSubscription?.service.objectId,
  //       label: serviceSubscription?.service.name,
  //     })) || [];
  // }
  console.log('daterange', dateRange)
  console.log('startDate', startDate)
  console.log('endDate', endDate)
  useEffect(() => {

    if (reportType && dateRange.startDate && dateRange.endDate) {
      handleDownloadClick(reportType == 'Attendance' ? 'file' : "data")
    }
    if (activeServices?.length && query.get('serviceId')) {
      if (query.get('serviceId') == 'all') {
        setSelectedService(activeServices?.map((obj) => {
          return {
            label: obj?.service?.name,
            value: obj?.service?.objectId,
          };
        }))
      } else {
        const obj = activeServices?.find(a => a?.service?.objectId === query.get('serviceId'))
        if (obj) {
          setSelectedService({
            label: obj?.service?.name,
            value: obj?.service?.objectId
          })
        }
      }


    }
    // setDateRange({
    //   startDate:
    // })
  }, [])
  return (
    <>
      <div className=" gap-6 p-4 flex flex-col">
        <div className="flex flex-col sm:flex-row pt-4 ">
          <Datepicker
            containerClassName="w-72 h-12"
            value={dateRange}
            theme={"light"}
            maxDate={new Date()}
            inputClassName="input input-bordered w-72"
            popoverDirection={"down"}
            toggleClassName="invisible"
            onChange={handleDatePickerValueChange}
            showShortcuts={false}
            primaryColor={"white"}
          />
          {isAdmin ? <div className="form-control w-full lg:w-2/12 mr-5 " P>
            <Select
              placeholder={"Client"}
              native={false}
              className={"ml-4"}
              onChange={setSelectedClient}
              options={allClients?.map(client => {
                return { value: client.objectId, label: client.name }
              })}
              value={
                selectedClient
              }
            />
          </div> : null}
          <div className="form-control sm:w-full md:w-full lg:w-2/12 mr-5 ">
            <Select
              native={true}
              className={"ml-4"}
              onChange={handleReportTypeChange}
              options={["Task", "Complaint", "Attendance", 'Service Request']}
              value={reportType}
            />
            {/* <select
              value={reportType}
              onChange={handleReportTypeChange}
              className="select select-md  h-max w-full border border-gray-300 bg-white text-blue-950  mx-3 "
            >
              <option
                className="text-blue-950 font-medium text-base"
                disabled
                value=""
              >
                Select Category
              </option>

              <option value="Task">Task</option>
              <option value="Complaint">Complaint</option>
              <option value="Attendance">Attendance</option>
            </select> */}
          </div>
          {(reportType === "Task" || reportType === "Complaint") ? (
            <div className=" sm:w-full md:w-full ml-2 lg:w-3/12 mr-5 ">
              <Select
                multiple={true}
                placeholder={"Service"}
                native={false}
                onChange={setSelectedService}
                options={activeServices?.map((obj) => {
                  return {
                    label: obj?.service?.name,
                    value: obj?.service?.objectId,
                  };
                })}
                value={selectedService}
              />
              {/* <label className="block font-bold mb-1">Services</label> */}
              {/* <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="select select-md  h-max w-full border border-gray-300 bg-white text-blue-950  mx-3 "
              >
                <option
                  className="text-blue-950 font-medium text-base"
                  disabled
                  // selected
                  value=""
                >
                  Select Service
                </option>

                {serviceOptions.map((obj) => (
                  <option value={obj.value}>{obj.label}</option>
                ))}
              </select> */}
            </div>
          ) : null}
          <div className="form-control sm:w-full md:w-full lg:w-3/12 mx-2">
            <div className="flex flex-row  justify-between ">
              <Button
                type="accent"
                className="gap-2 text-white hover:dark:text-accent"
                onClick={(e) => handleDownloadClick("file")}
                disabled={!(startDate && endDate) || loading}
              >
                <CloudArrowDownIcon className="w-5 h-5" />
                Download
              </Button>
              <Button
                className="gap-2 text-white hover:dark:text-accent"
                onClick={(e) => handleDownloadClick("data")}
                disabled={
                  !(startDate && endDate && reportType !== "Attendance") ||
                  loading
                }
              >
                <EyeIcon className="w-5 h-5" />
                View
              </Button>
            </div>
          </div>
        </div>
        {reportType !== "Attendance" ? (
          <div className="mt-1">
            <DataGrid
              downloadFileName={`${reportType}_Report_${moment(
                startDate
              ).format("YYYY-MM-DD")}_${moment(endDate).format("YYYY-MM-DD")}`}
              name={reportType + " Report"}
              data={data}
              loading={loading}
              columnDefs={getColumnDefs(reportType, data)}

            />
          </div>
        ) : null}
      </div>
      {isModalOpen ? (
        <Modal
          fullscreen
          title={"Task"}
          closeModal={() => setIsModalOpen(!isModalOpen)}
          showModal={isModalOpen}
          showBtns={false}
          onSubmit={() => { }}
        >
          <TaskActivityDetails
            source="task"
            taskActivityId={selectedRecord?.taskActivityId}
            serviceName={selectedRecord?.serviceName}
            onChange={(e) => handleDownloadClick("data")}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default Reports;
