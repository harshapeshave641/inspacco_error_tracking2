import React, { useState } from "react";
import Papa from "papaparse";
import Button from "../../components/common/neomorphic/Button";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_SERVICES } from "../../graphql/queries/service";
import {
  extractPincode,
  fetchBankDetails,
  findMatchingWords,
  pickupDataFromResponse,
} from "../../helpers/utils";
import { useSelector } from "react-redux";
import { CREATE_SERVICE_REQUEST } from "../../graphql/mutations/serviceRequest/createServiceRequest";
import { result } from "lodash";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import DataGrid from "../../components/common/DataTable/DataGrid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { serviceSubServices } from "../../constants";
import _ from "lodash";
import { SEARCH_FACILITY_BY_UNIIQUECODE } from "../../graphql/queries/clientfacility";
function StatusRenderer({ value }) {
  return (
    <span>
      {value === "success" ? (
        <CheckIcon scale={2} color="green" className="w-5 h-5" />
      ) : (
        <XMarkIcon color="red" className="w-5 h-5" />
      )}
    </span>
  );
}
const ServiceRequestBulkUpload = ({ onDone }) => {
  // return <div>none</div>
  const { data: servicesData } = useQuery(GET_ALL_SERVICES);
  const [csvData, setCsvData] = useState(null);
  const [uploadResult, setUploadResult] = useState([]);
  const { activeSociety, user } = useSelector((state) => state.authSlice);
  const [createServiceRequest] = useMutation(CREATE_SERVICE_REQUEST);
  const [searchClientFacilityByUniqueCode] = useLazyQuery(
    SEARCH_FACILITY_BY_UNIIQUECODE
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    console.log("file", e.target);
    const file = e.target.files[0];
    setSelectedFile(e.target.files[0]);
    setFileName(file?.name);
    const reader = new FileReader();
    console.log("file", file);
    reader.onload = (event) => {
      const csvText = event.target.result;
      try {
        const result = Papa.parse(csvText, { header: true });
        setCsvData(result.data);
      } catch (e) {}

      //  setUploadResult([]);
    };

    reader.readAsText(file);
  };

  const handleCreateNewSR = async (row) => {
    console.log("row", row);
    const serviceName = row["Service Name"];
    let subService = row["Sub Service"];
    const uniqueCode = row["Unique Code"];
    const scopeOfWork = row["Scope Of Work"];
    let pocName = row["POC Name"];
    let pocContactDetails = row["POC Contact Details"];
    const externalReferenceNumber = row["External Reference Number"];
    let email;
    if (!scopeOfWork) {
      throw new Error("Please Provide a scope of work");
    }
    if (!serviceName) {
      throw new Error("Please Provide a service name");
    }
    const societyName = activeSociety?.name;
    let pincode, city, state, address, facilityName;
    if (subService) {
      const parentService = serviceSubServices.find(
        (obj) => obj.name === serviceName?.split(" ")?.[0]?.toUpperCase()
      );
      // console.log('parentService',parentService,subService);
      let subServiceName = parentService?.subServices?.find(
        (obj) => obj.name?.toLowerCase() === subService?.toLowerCase()
      )?.name;
      if (subServiceName) {
        subService = subServiceName;
      } else {
        subService = "";
      }
    }
    try {
      let useOwnDataSource = true;
      if (!useOwnDataSource) {
        const obj = await fetchBankDetails(uniqueCode, societyName);
        state = obj?.STATE;
        city = obj?.CITY;
        facilityName = obj?.BRANCH;
        address = `${obj.BRANCH},${obj.ADDRESS}`;
        pincode = extractPincode(address);
      } else {
        const clientFacilityRes = await searchClientFacilityByUniqueCode({
          variables: {
            uniqueCode: uniqueCode,
            clientId: activeSociety?.objectId,
          },
        });

        console.log(
          "clientFacilityRes",
          pickupDataFromResponse({ data: clientFacilityRes?.data })
        );
        const clientFacilities = pickupDataFromResponse(clientFacilityRes);
        if (clientFacilities?.length > 0) {
          const clientFacility = clientFacilities[0];
          state = clientFacility?.state;
          city = clientFacility?.city;
          facilityName = clientFacility?.name;
          address = `${clientFacility.address}`;
          pocName = pocName || clientFacility?.POCName;
          pocContactDetails =
          pocContactDetails || clientFacility?.POCMobileNumber;
          email = email || clientFacility?.POCEmail;
          pincode = pincode || clientFacility?.pincode
        }
      }
    } catch (e) {
      console.error(e.st)
    }

    const services = pickupDataFromResponse({ data: servicesData }) || [];
    const service = services.find(
      (service) =>
        service?.name?.trim()?.toLowerCase() ===
        serviceName?.trim()?.toLowerCase()
    );
    if (!service) {
      throw new Error("Service not found");
    }
    const requirement = [
      {
        group: "G1",
        fields: [
          {
            label: "Scope Of Work",
            name: "scopeOfWork",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: scopeOfWork,
          },
          {
            label: "Facility Unique Code",
            name: "uniqueCode",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: uniqueCode,
          },
          {
            label: "Address",
            name: "societyAddress",
            isRequired: true,
            type: "TEXTAREA",
            value: address,
          },
          {
            label: "Facility Name",
            name: "facilityName",
            isRequired: false,
            type: "TEXTAREA",
            value: facilityName,
          },
          {
            label: "Pincode",
            name: "pincode",
            isRequired: false,
            type: "TEXTAREA",
            value: pincode,
          },
          {
            label: "City",
            name: "city",
            isRequired: true,
            type: "TEXTAREA",
            value: city,
          },
          {
            label: "State",
            name: "state",
            isRequired: true,
            type: "TEXTAREA",
            value: state,
          },
          {
            label: "Budget Allocated",
            name: "targetPricing",
            isRequired: true,
            type: "TEXTAREA",
            value: "",
          },
          {
            label: "POC Name",
            name: "pocName",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: pocName,
          },
          {
            label: "POC Mobile Number",
            name: "mobileNumber",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: pocContactDetails,
          },
          {
            label: "POC Email",
            name: "email",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: email,
          },
          {
            label: "Reference Number(External)",
            name: "referenceNumber",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: externalReferenceNumber,
          },
        ],
      },
    ];
    console.log("requirement", requirement);
    const inputFields = {
      requester: {
        link: user.objectId,
      },
      service: {
        link: service?.objectId,
      },
      status: "TO_BE_WORKED_UPON",
      subService,
      requirement: JSON.stringify(requirement),
      society: {
        link: activeSociety?.objectId,
      },
    };

    const createServiceRequestRes = await createServiceRequest({
      variables: {
        input: {
          fields: inputFields,
        },
      },
    });
    console.log("createServiceRequestRes", createServiceRequestRes);
    // toast.success(`Service Request Created Successfully!`);
    // onCloseCallback();
    return createServiceRequestRes;
  };

  const uploadData = async () => {
    if (!csvData) {
      alert("Please upload a CSV file first.");
      return;
    }
    console.log("csvData");
    console.log(csvData);
    setLoading(true);
    try {
      for (let row of csvData) {
        try {
          if (!_.isEmpty(row)) {
            const res = await handleCreateNewSR(row);
            const serviceRequest =
              res?.data?.createServiceRequest?.serviceRequest;
            // results.push();
            console.log("Scope Of Work", row["Scope of Work"]);
            setUploadResult((prevResult) => [
              ...prevResult,
              {
                data: row,
                displayId: serviceRequest?.displayId,
                scopeOfWork: row["Scope of Work"],
                pocName: row["POC Name"],
                serviceName: row["Service Name"],
                subService: row["Sub Service"],
                success: true,
                message: "",
              },
            ]);
          }
        } catch (error) {
          console.error("Error uploading data:", error);
          // result.push();
          setUploadResult((prevResult) => [
            ...prevResult,
            {
              data: row,
              scopeOfWork: row["Scope of Work"],
              serviceName: row["Service Name"],
              pocName: row["POC Name"],
              success: false,
              message: error.message?.includes('duplicate value')? 'Duplicate UniqueCode' : error.message,
            },
          ]);
        }
      }
      // setCsvData([])
      setSelectedFile(null);
    } catch (e) {
    } finally {
      setSelectedFile(null);
      setLoading(false);
    }

    // setUploadResult(result);
  };

  let columns = [];
  if (csvData?.[0]) {
    columns = ["Request No", ...Object.keys(csvData?.[0]), "Status", "Message"];
  }
  const handleRowEditingStopped = (event) => {
    const updatedRowData = [...rowData];
    const updatedRowIndex = event.rowIndex;
    const updatedRow = event.data;
    updatedRowData[updatedRowIndex] = updatedRow;
    console.log("Updated Row Data:", updatedRowData);
    // Now you have access to the latest edited row data in updatedRowData
  };
  const downloadSampleCSV = () => {
    const csvContent = `Service Name,Sub Service,Scope Of Work,Unique Code,Priority Level,POC Name,POC Contact Details,External Reference Number`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <div className="flex justify-between mt-10">
        <div className="flex">
          <div>
            <input
              type="file"
              accept=".csv"
              multiple={false}
              // value={selectedFile}
              onChange={handleFileChange}
              className="invisible w-0 h-0"
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <span className="btn btn-sm btn-neutral ">Upload CSV File</span>
            </label>
            <div>{selectedFile?.name}</div>
          </div>
          <div>
            <Button
              onClick={uploadData}
              disabled={!selectedFile}
              className="ml-3 btn-sm"
              loading={loading}
            >
              Upload Data
            </Button>
          </div>
        </div>
        <div className="">
          <button className="btn btn-link" onClick={downloadSampleCSV}>
            Download Sample CSV
          </button>{" "}
        </div>
      </div>
      {uploadResult?.filter((a) => a?.success)?.length ? (
        <div className="bg-success">
          <span>
            {uploadResult?.filter((a) => a?.success)?.length}/
            {uploadResult?.length} Service Request Processed{" "}
          </span>
        </div>
      ) : null}
      {uploadResult?.filter((a) => !a?.success)?.length ? (
        <div style={{ backgroundColor: "red" }}>
          <span>
            {uploadResult?.filter((a) => !a?.success)?.length}/
            {uploadResult?.length} Service Request Failed{" "}
          </span>
        </div>
      ) : null}
      {csvData && (
        <>
          <div className="">
            <DataGrid
              download={true}
              downloadFileName={`${fileName?.replace(".csv", "")}_failed`}
              name={"Failed Service Request"}
              data={uploadResult
                ?.filter((a) => !a?.success)
                .map((obj) => {
                  return {
                    "Request No": obj?.displayId,
                    ...obj.data,
                    Status: obj.success ? "success" : "failure",
                    Message: obj.message,
                  };
                })}
              onRowEditingStopped={handleRowEditingStopped}
              loading={false}
              columnDefs={columns?.map((column) => {
                let options = {};
                if (column === "Status") {
                  options = { ...column, cellRenderer: StatusRenderer };
                  // ag grid react custom cell render based on status
                }
                if (["Status", "Message"].includes(column)) {
                  options = { ...options, pinned: "right" };
                }
                if (column === "Request No") {
                  options = { ...options, pinned: "left" };
                }
                if (column == "Service Name") {
                  options = { ...options, editable: true };
                }
                return {
                  headerName: column,
                  field: column,
                  width: 200,
                  ...options,
                };
              })}
              style={{ height: `${window.innerHeight - 220}px` }}
            />
            {/* <Table className="mt-4">
              <thead>
                <tr>
                  {columns?.map((key) => (
                    <th>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="h-300 overflo-y-auto">
                {uploadResult?.map((row, index) => (
                  <tr key={index}>
                    <td>{row?.data?.displayId}</td>
                    <td>{row["serviceName"]}</td>
                    <td>{row["scopeOfWork"]}</td>
                    <td>{row["pocName"]}</td>
                    <td>
                      {row.success ? (
                        <CheckCircleIcon color="green" />
                      ) : (
                        <XCircleIcon color="red" />
                      )}
                    </td>
                    <td>{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceRequestBulkUpload;
