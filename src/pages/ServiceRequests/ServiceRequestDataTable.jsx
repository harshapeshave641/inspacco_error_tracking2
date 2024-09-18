import React, { useMemo, useState } from "react";
import moment from "moment";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { isEmpty, orderBy } from "lodash";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

import DataGrid from "../../components/common/DataTable/DataGrid";

import {
  getRequirementDataAsPlainObject,
  handleDownload,
  pickupDataFromResponse,
} from "../../helpers/utils";
import { calculateTAT } from "../../helpers/servicerequesttat";

import {
  SERVICE_QUOTATION_STATUS,
  SERVICE_REQUEST_ATTACHMENT_TYPES,
  SERVICE_REQUEST_STATUS_OPTIONS,
} from "../../constants";

import Button from "../../components/common/neomorphic/Button";
import Table from "../../components/common/neomorphic/Table";
import ConfirmationBox from "../../components/common/Dialog/ConfirmationBox";
import HyperlinkCellRenderer from "../../components/common/DataTable/HyperlinkCellRenderer";
import Text from "../../components/common/Typography/Text";

import { UPDATE_SERVICE_REQUEST } from "../../graphql/mutations/serviceRequest/updateServiceRequestStatus";
import { UPDATE_SERVICE_QUOTATION_STATUS_BY_ID } from "../../graphql/mutations/serviceQuotation/updateServiceQuotationStatus";
import {
  CheckCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownOnSquareStackIcon } from "@heroicons/react/20/solid";

import apiEnv from "../../env";
import Popover from "../../components/common/PopOver";
import Select from "../../components/common/neomorphic/Select";
import CheckboxGroup from "../../components/common/CheckboxGroup";

function updateGridData(data) {
  console.log("upgradeGridData ---- inside serviceRequestTable", data);
  const serviceRequests = pickupDataFromResponse({ data }) || [];
  return serviceRequests?.map((serviceRequest) => {
    const {
      displayId: srNumber,
      objectId: serviceRequestId,
      createdAt,
      visitDate,
      service,
      society,
      status,
      priority,
      requirement,
      resolutionComment,
      subService,
      activityHistory,
      quotations,
      requester,
      objectId,
    } = serviceRequest || {};

    console.log("the date is", createdAt);
    console.log(typeof createdAt);

    let serviceQuotations = quotations?.edges?.map(({ node }) => node);
    serviceQuotations =
      orderBy(serviceQuotations, ["createdAt"], ["desc"]) || [];
    const activeQuotation = serviceQuotations?.[0];
    // console.log('DATa TAbleQoutations',serviceQuotations)
    const { name: serviceName } = service || {};
    const { name: societyName } = society || {};
    const requirementObj = getRequirementDataAsPlainObject(requirement);
    // const visitCompleted = status?.includes("VISIT_DONE");
    // const quoteSubmitted = status == "QUOTATION_APPROVAL_PENDING";
    // const workCompleted = SERVICE_REQUEST_STATUS_OPTIONS?.find(
    //   (statusObj) =>
    //     statusObj.value == status && statusObj.status == "Completed"
    // );
    const {
      visitCompleted,
      quoteSubmitted,
      workCompleted,
      quoteApproved,
      quoteApprovalTAT,
      workCompletedTAT,
      quoteSubmissionTAT,
      visitTAT,
    } = calculateTAT(
      serviceRequest,
      activityHistory?.edges
        ?.map((a) => a.node)
        .filter((activity) => activity.action == "editServiceRequestStatus")
        .map((activity) => {
          return {
            status: activity.value,
            date: activity.createdAt,
          };
        })
    );

    const _checkSRValidity = () => {
      const conditions = [
        {
          expr: () => status === "QUOTATION_APPROVAL_PENDING",
          failureReason: "SR Status is not QUOTATION_APPROVAL_PENDING!",
        },
        {
          expr: () => !!activeQuotation?.actualAmount,
          failureReason: "Active Quotation Value is invalid!",
        },
        {
          expr: () =>
            serviceQuotations.filter(({ status }) => status === "OPEN")
              .length === 1,
          failureReason: "More than one quotation have OPEN status!",
        },
      ];

      let result = {
        isValid: true,
        failureReason: null,
      };
      for (let condition of conditions) {
        if (!condition.expr()) {
          result.isValid = false;
          result.failureReason = condition.failureReason; // You can customize this as needed
          break;
        }
      }

      return result;
    };

    const srValidityInfo = _checkSRValidity();
    // console.log("srValidityInfo", srValidityInfo);

    return {
      id: serviceRequestId,
      "Service Request No": srNumber,
      "Ref No": requirementObj["Reference Number(External)"],
      "Service Name": serviceName,
      "Facility Name": requirementObj["Facility Name"],
      Requester: `${requester?.firstName} ${requester?.lastName}`,
      "SR Date Time": new Date(createdAt),
      "Sub Service": subService,
      "Sub Status": status,
      serviceQuotations,
      Status: SERVICE_REQUEST_STATUS_OPTIONS?.find((a) => a.value === status)
        ?.status,
      "Visit Time": visitDate ? new Date(visitDate) : "",
      Priority: priority,
      "Resolution Comment": resolutionComment,
      Client: societyName,
      "Visit Completed": visitCompleted ? "Yes" : "No",
      "Quote Submitted": quoteSubmitted ? "Yes" : "No",
      "Qoute Approved": quoteApproved ? "Yes" : "No",
      "Work Completed": workCompleted ? "Yes" : "No",
      "Visit TAT(days)": visitTAT,
      "Quote Submission TAT(days)":
        Math.sign(quoteSubmissionTAT) == -1 ? "N/A" : quoteSubmissionTAT,
      "Work Completed TAT(days)":
        Math.sign(workCompletedTAT) == -1 ? "N/A" : workCompletedTAT,
      "Quote Approval TAT(days)":
        Math.sign(quoteApprovalTAT) == -1 ? "N/A" : quoteApprovalTAT,
      "Quotation Value": activeQuotation ? activeQuotation?.actualAmount : "",
      "Quotation Status": activeQuotation ? activeQuotation?.status : "",
      // "Quotation Total": activeQuotation ? activeQuotation?.totalAmount : "",
      isValidSR: srValidityInfo.isValid,
      Validity: srValidityInfo.isValid ? (
        <CheckCircleIcon className="w-6 h-6 text-green-400" />
      ) : (
        <div
          className="tooltip tooltip-left"
          data-tip={srValidityInfo.failureReason}
        >
          <XCircleIcon className="w-6 h-6 text-red-400 cursor-pointer" />
        </div>
      ),
      ...requirementObj,
    };
  });
}

export default function ServiceRequestDataTable({
  loading,
  data,
  openSRDetailsModal,
  syncServiceRequest,
}) {
  const gridData = useMemo(() => updateGridData(data), [data]);
  // const [showSRDetailsModal, setShowSRDetailsModal] = useState(false);
  // const [selectedSR, setSelectedSR] = useState({});
  const [showBulkApprovalModal, setShowBulkApprovalModal] = useState(false);
  const [isQuotationSubmitInProgress, setIsQuotationSubmitInProgress] =
    useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [selectedAttachmentTypes, setSelectedAttachmentTypes] = useState([]);
  const { isAdmin, sessionToken } = useSelector((state) => state.authSlice);
  const [updateServiceRequest] = useMutation(UPDATE_SERVICE_REQUEST);
  const [updateServiceQuotation] = useMutation(
    UPDATE_SERVICE_QUOTATION_STATUS_BY_ID
  );
  const [isDownloadingAttachments, setIsDownloadingAttachments] =
    useState(false);
  const _handleRemoveSelectedRow = (serviceRequest) => {
    setSelectedRowsData(
      selectedRowsData.filter(({ id }) => id !== serviceRequest.id)
    );
  };

  const handleBulkApprove = (rows) => {
    setSelectedRowsData(rows.map((row) => ({ ...row, Actions: "" })));
    // show modal with affected quotations in a table with affected values i.e. total
    setShowBulkApprovalModal(true);
  };

  const handleDownloadAttachments = (selectedRows) => {
    if (!selectedRows.length) {
      toast.warning("Please select Service Requests");
      return false;
    }
    const payload = {
      ids: selectedRows?.map((obj) => obj?.id),
      attachmentTypes: selectedAttachmentTypes,
    };
    const fileName = `Service_Requests_Attachments_${moment().format(
      "YYYY-MM-DD"
    )}.zip`;
    setIsDownloadingAttachments(true);
    fetch(apiEnv.host + "/api/service-requests/attachments/download", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "X-Parse-Session-Token": sessionToken,
        "Content-Type": "application/json",
        "X-Parse-Application-Id": "inspacco-parse-server",
      },
    })
      .then((res) => handleDownload(res, fileName))
      .finally(() => {
        setIsDownloadingAttachments(false);
      });
  };

  const checkBulkApprovalValidations = (selectedRows) => {
    let msg = "";
    let allRowsHasQuotationPendingStatus = selectedRows.every(
      (sr) => sr["Sub Status"] === "QUOTATION_APPROVAL_PENDING"
    );

    if (isEmpty(selectedRows)) msg = "Select atleast 1 row for approval!";
    else if (!allRowsHasQuotationPendingStatus)
      msg =
        "Select only service requests with Quotation approval pending status!";

    if (msg) toast.warning(msg);
    return { isValid: !msg };
  };

  const _getStatusValueFrom = (arr, target) =>
    arr.find(({ value }) => value === target)?.value;

  const _confirmBulkApproval = async () => {
    setIsQuotationSubmitInProgress(true);
    const toastId = toast.loading(
      "Approving all valid quotations, Please wait...",
      {
        autoClose: false,
        type: toast.TYPE.INFO,
      }
    );

    // Use Promise.all to wait for all quotation updates to complete
    await Promise.all(
      selectedRowsData
        .filter(({ isValidSR }) => isValidSR)
        .map(async (selectedSR) => {
          const activeQuotationId = selectedSR.serviceQuotations[0].objectId;
          await _updateQuotationStatus(activeQuotationId, selectedSR);
        })
    );

    // Update the toast message after all quotations are approved
    toast.update(toastId, {
      render: "Quotations Approved Successfully!",
      isLoading: false,
      type: toast.TYPE.SUCCESS,
      autoClose: 5000,
    });

    setIsQuotationSubmitInProgress(false);
    setShowBulkApprovalModal(false);
    setSelectedRowsData([]);
  };

  const _updateServiceRequestStatus = async (selectedService, data) => {
    const fieldsUpdateArray = [
      "priority",
      "visitDate",
      "status",
      "resolutionComment",
    ];
    const inputFields = {};
    fieldsUpdateArray.forEach((field) => {
      if (data[field]) inputFields[field] = data[field];
    });

    const updatedSRData = await updateServiceRequest({
      variables: {
        ID: selectedService.id,
        fields: inputFields,
      },
    });

    // sync sr data
    const updateServiceRequestData =
      updatedSRData?.data?.updateServiceRequest?.serviceRequest || {};
    syncServiceRequest(updateServiceRequestData);

    toast.success(
      `Service Request #${selectedService["Service Request No"]} updated Successfully!`
    );
  };

  const _updateQuotationStatus = async (selectedQuotationId, selectedSR) => {
    await updateServiceQuotation({
      variables: {
        id: selectedQuotationId,
        status: _getStatusValueFrom(SERVICE_QUOTATION_STATUS, "ACCEPTED"),
      },
    });

    await _updateServiceRequestStatus(selectedSR, {
      status: _getStatusValueFrom(
        SERVICE_REQUEST_STATUS_OPTIONS,
        "QUOTATION_APPROVED"
      ),
    });
  };

  return (
    <>
      <DataGrid
        download={true}
        downloadFileName={`ServiceRequests`}
        rowSelection={"multiple"}
        actionComp={(params) => (
          <>
            <Button
              type="outline"
              className={`${isAdmin ? "hidden" : ""} gap-2 mr-2 btn-sm text-xs`}
              onClick={() => {
                const selectedRows = params?.getSelectedRows();
                if (checkBulkApprovalValidations(selectedRows).isValid)
                  handleBulkApprove(selectedRows);
              }}
            >
              <ClipboardDocumentCheckIcon className="w-5 h-5" />
              Approve Selected
            </Button>
            <Popover
              content={
                <div className="w-full">
                  <CheckboxGroup
                    options={SERVICE_REQUEST_ATTACHMENT_TYPES}
                    onChange={(values) => {
                      console.log("values", values);
                      setSelectedAttachmentTypes(values);
                    }}
                  />
                  <Button
                    loading={isDownloadingAttachments}
                    type="outline"
                    className="btn-sm"
                    disabled={selectedAttachmentTypes.length === 0}
                    onClick={() => {
                      const selectedRows = params?.getSelectedRows();

                      handleDownloadAttachments(selectedRows);
                    }}
                  >
                    Download
                  </Button>
                </div>
              }
            >
              <Button
                type="outline"
                className={`gap-2 mr-2 btn-sm text-xs`}
                onClick={() => {
                  const selectedRows = params?.getSelectedRows();

                  handleDownloadAttachments(selectedRows);
                }}
              >
                <ArrowDownOnSquareStackIcon className="w-5 h-5" />
                Download Attachments
              </Button>
            </Popover>
            <Button
              type="outline"
              className={`hidden gap-2 mr-2 btn-sm text-xs`}
              onClick={() => {
                const selectedRows = params?.getSelectedRows();

                handleDownloadAttachments(selectedRows);
              }}
            >
              <ArrowDownOnSquareStackIcon className="w-5 h-5" />
              Download Attachments
            </Button>
          </>
        )}
        name={"Service Requests"}
        data={gridData}
        loading={loading || isQuotationSubmitInProgress}
        columnDefs={Object.keys(gridData?.[0] || {})?.map((key) => ({
          field: key,
          headerName: key,
          hide: [
            "id",
            "serviceQuotations",
            "isValidSR",
            "Ref No",
            "Validity",
          ].includes(key),
          type: ["SR Date Time", "Visit Time"].includes(key) ? "datetime" : "",
          ...(key == "Service Request No" && {
            cellRenderer: HyperlinkCellRenderer,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            // cellRenderer: (params) => {
            //   if (
            //     selectedRowsRef.current.find(
            //       ({ disaplyId }) => disaplyId === params.data.displayId
            //     )
            //   ) {
            //     params.node.setSelected(true);
            //     return HyperlinkCellRenderer;
            //   }
            // },
            cellRendererParams: {
              onClick: (props) => {
                const currentSRData = pickupDataFromResponse({ data }).find(
                  ({ displayId }) => displayId === props.value
                );
                openSRDetailsModal(true, currentSRData);
              },
            },
          }),
          pinned:
            key == "Service Request No"
              ? "left"
              : key == "Status"
              ? "right"
              : "",
        }))}
        style={{ height: `${window.innerHeight - 275}px` }}
      />
      {showBulkApprovalModal ? (
        <ConfirmationBox
          className="w-[75vw] max-w-[75vw]"
          isOpen={showBulkApprovalModal}
          title={"Approve below Valid Service Requests' Quotation?"}
          message={
            <>
              <Table
                columns={Object.keys(selectedRowsData?.[0] || {})
                  .filter((key) =>
                    [
                      "Service Request No",
                      "Ref No",
                      "Service Name",
                      "Facility Name",
                      "Quotation Value",
                      "Validity",
                      "Actions",
                    ].includes(key)
                  )
                  .map((key) => ({
                    name: key,
                    selector: (rowInfo) =>
                      key.includes("Actions") ? (
                        <TrashIcon
                          className="w-4 h-4 text-red-500 duration-300 cursor-pointer hover:text-red-700"
                          onClick={() => _handleRemoveSelectedRow(rowInfo)}
                        />
                      ) : (
                        <div>
                          {key.includes("Date")
                            ? rowInfo[key].toLocaleDateString()
                            : ["Quotation Value"].includes(key)
                            ? `₹ ${rowInfo[key]}`
                            : rowInfo[key] || "-"}
                        </div>
                      ),
                  }))}
                data={selectedRowsData.map((rowData) => ({
                  ...rowData,
                  Actions: "",
                }))}
              />
              <div className="font-semibold text-right text base">
                <Text>Grand Total: </Text>
                <Text className="ml-2">
                  ₹{" "}
                  {selectedRowsData.reduce((acc, rowData) => {
                    if (rowData.isValidSR)
                      acc += Number(rowData["Quotation Value"]);
                    return acc;
                  }, 0)}
                </Text>
              </div>
            </>
          }
          confirmText="Approve"
          onConfirm={() => _confirmBulkApproval()}
          confirmDisabled={isEmpty(
            selectedRowsData.filter(({ isValidSR }) => isValidSR)
          )}
          onCancel={() => setShowBulkApprovalModal(false)}
        />
      ) : null}
    </>
  );
}
