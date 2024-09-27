import React, { useState } from "react";
import Papa from "papaparse";

import { useMutation, useQuery } from "@apollo/client";


import { useSelector } from "react-redux";




import { CheckIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

import _ from "lodash";
import { downloadFileFromContent, getPincodeInfo } from "../../../helpers/utils";
import { CREATE_CLIENT_FACILITY, DELETE_CLIENT_FACILITY, UPDATE_CLIENT_FACILITY } from "../../../graphql/mutations/clientfacilty";
import Button from "../../../components/common/neomorphic/Button";
import DataGrid from "../../../components/common/DataTable/DataGrid";
import { ClientFacilityFieldMapping } from "../../../constants";


function TestError1() {
    const a=2;
    a.nono();
  }
const mandatoryFields = ["Name", "Unique Code", "Address", "Pincode"]
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
const BulkClientFacility = ({ activeSociety, onDone, clientFacilities = [] }) => {
    // return <div>none</div>

    const [csvData, setCsvData] = useState(null);
    const [uploadResult, setUploadResult] = useState([]);

    const [createClientFacility] = useMutation(CREATE_CLIENT_FACILITY);
    const [updateClientFacility] = useMutation(UPDATE_CLIENT_FACILITY);
    const [deleteClientFacility] = useMutation(DELETE_CLIENT_FACILITY);

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
            } catch (e) { }

            //  setUploadResult([]);
        };

        reader.readAsText(file);
    };

    const handleCreateNewSR = async (row) => {

        mandatoryFields.forEach((field) => {
            if (!row[field]) {
                throw new Error(`${field} is mandatory`);
            }
        })
        let pincodeRes;
        try {
            pincodeRes = await getPincodeInfo(row?.Pincode);
        } catch (e) {
            pincodeRes = {}
        }

        const clientFacilty = {}
        Object.keys(row)?.map((key) => {
            clientFacilty[ClientFacilityFieldMapping[key]] = row[key];
        })
        clientFacilty['state'] = clientFacilty['state'] || pincodeRes?.["State"]
        clientFacilty['city'] = clientFacilty['city'] || pincodeRes?.["Region"]
        console.log("activeSociety", activeSociety);
        const recrodExist = clientFacilities?.find(cF => cF.uniqueCode === clientFacilty?.uniqueCode);
        console.log("recrodExist", recrodExist);
        if (recrodExist) {
            const createClientFacilityResponse = await updateClientFacility({
                variables: {
                    id: recrodExist?.objectId,
                    fields: clientFacilty
                },
            });
            // throw new Error(`Record with unique code ${clientFacilty?.uniqueCode} already exist`);
        } else {
            const inputFields = {
                client: {
                    link: activeSociety?.objectId,
                },
                ...clientFacilty
            };

            const createClientFacilityResponse = await createClientFacility({
                variables: {
                    input: inputFields
                },
            });
            console.log("createClientFacilityResponse", createClientFacilityResponse);
        }

        // toast.success(`Service Request Created Successfully!`);
        // onCloseCallback();
        // return createClientFacilityResponse;
    };

    const uploadData = async () => {
        if (!csvData) {
            alert("Please upload a CSV file first.");
            return;
        }
        console.log("csvData");
        console.log(csvData);
        setLoading(true);
        const uniqueCodes = csvData?.map(a => a['Unique Code'])
        const deletedClientFacilities = clientFacilities?.filter(cf => !uniqueCodes.includes(cf['uniqueCode']))
        try {

            for (let row of csvData) {
                try {
                    if (!_.isEmpty(row)) {
                        const res = await handleCreateNewSR(row);

                        console.log("Scope Of Work", row["Scope of Work"]);
                        setUploadResult((prevResult) => [
                            ...prevResult,
                            {
                                data: row,
                                // displayId: serviceRequest?.displayId,
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
                            message: error.message,
                        },
                    ]);
                }
            }
            // setCsvData([])
            setSelectedFile(null);
        } catch (e) {

        } finally {
            console.log('deletedClientFacilities', deletedClientFacilities)
            setSelectedFile(null);
            await Promise.all(deletedClientFacilities?.map(cf => deleteClientFacility({ variables: { id: cf?.objectId } })))
            onDone()
            setLoading(false)

        }

        // setUploadResult(result);
    };

    let columns = [];
    if (csvData?.[0]) {
        columns = ["Request No", ...Object.keys(csvData?.[0]), "Status", "Message"];
    }

    const downloadSampleCSV = () => {
        const csvContent = Object.keys(ClientFacilityFieldMapping)?.join(',');
        downloadFileFromContent(csvContent, 'text/csv', 'samplecleintfacilty.csv');
    };
    return (
        <div className="mt-5">
            <TestError1/>
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
                        {uploadResult?.length} Client Facilities Processed{" "}
                    </span>
                </div>
            ) : null}
            {uploadResult?.filter((a) => !a?.success)?.length ? (
                <div style={{ backgroundColor: "red" }}>
                    <span>
                        {uploadResult?.filter((a) => !a?.success)?.length}/
                        {uploadResult?.length} Client Facilities Failed{" "}
                    </span>
                </div>
            ) : null}
            {csvData && uploadResult?.filter((a) => !a?.success)?.length && (
                <>
                    <div className="">
                        <DataGrid
                            download={true}
                            downloadFileName={`${fileName?.replace(".csv", "")}_failed`}
                            name={"Failed Client Facilities`}"}
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
                            // onRowEditingStopped={handleRowEditingStopped}
                            loading={false}
                            columnDefs={columns?.map((column) => {

                                return {
                                    headerName: column,
                                    field: column,
                                    width: 200,

                                };
                            })}
                            style={{ height: `${window.innerHeight - 220}px` }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default BulkClientFacility;
