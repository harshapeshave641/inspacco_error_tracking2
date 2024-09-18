import React, { Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { ChatBubble } from "react-daisyui";
import {
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  ReceiptRefundIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/solid";

import Text from "../../components/common/Typography/Text";
import Button from "../../components/common/neomorphic/Button";
import ConfirmationBox from "../../components/common/Dialog/ConfirmationBox";
import DynamicField from "../../components/common/DynamicField";

import {
  _calculatePercentage,
  _isEmpty,
  convertImgToDataURI,
  getFileUrl,
  getRequirementDataAsPlainObject,
} from "../../helpers/utils";

import { CREATE_SERVICE_QUOTATION } from "../../graphql/mutations/serviceQuotation/createServiceQuotation";
import { UPDATE_SERVICE_QUOTATION_STATUS_BY_ID } from "../../graphql/mutations/serviceQuotation/updateServiceQuotationStatus";
import {
  SERVICE_QUOTATION_STATUS,
  SERVICE_REQUEST_STATUS_OPTIONS,
} from "../../constants";
import CreateNewQuotationForm from "./CreateNewQuotationForm";
import Separator from "../../components/common/Separator";
import EmptyData from "../../components/common/EmptyData";

const _formatItemsArr = (arr) =>
  arr
    .map(({ node }, index) => ({
      work_Description: node.serviceDescription,
      qty: node.quantity,
      rate: node.rate,
      unit: node.unit,
      amount: node.amount,
      serialNumber: node.serialNumber || index + 1,
      isContractual: node.isContractual
    }))
    .sort((a, b) => a.serialNumber - b.serialNumber);

export default function CreateQuotationModal({
  data,
  readOnly = false,
  selectedServicePartners,
  selectedQuotation,
  onCloseCallback,
  onSubmit,
}) {
  const { isAdmin } = useSelector((store) => store.authSlice);

  const requirementFieldsObj = getRequirementDataAsPlainObject(
    data.requirement
  );

  const mode =
    (isAdmin && selectedQuotation.status === "OPEN") || !readOnly
      ? "EDIT"
      : "READ_ONLY";

  const subTotal = readOnly ? selectedQuotation.actualAmount : 0;
  const mgmtFeeAmt = 0;
  //   readOnly && selectedQuotation.otherCharges
  //     ? _calculatePercentage(subTotal, selectedQuotation.otherCharges)
  //     : 0;
  const discountAmt =
    readOnly && selectedQuotation.discount
      ? _calculatePercentage(
          Number(subTotal) + Number(mgmtFeeAmt),
          selectedQuotation.discount
        )
      : 0;

  const gstNo = "27AAFCS4166H1Z6";

  const IS_INSPACCO_QUOTATION_PROVIDER =
    data?.society?.settings?.["IS_INSPACCO_QUOTATION_PROVIDER"];
    console.log("IS_INSPACCO_QUOTATION_PROVIDER", IS_INSPACCO_QUOTATION_PROVIDER)
  let clientObj = IS_INSPACCO_QUOTATION_PROVIDER? {
    registeredEntityName:"Prophandy Technologies Private Limited",
    CINNumber:"U74110PN2019PTC185573",
    POCMobileNumber:"09370519120",
    GSTNo:"27AAKCP6754D1Z6",
    GSTState:"Maharashtra",
    addressLine1:"Fiesta Society, Near Roharsh Motor",
    addressLine2:"Flat No B-802, Sr.No 35/2/1/2,",
    area:"Baner",
    city:"Pune",
    pincode:"411005",
    state:"Maharashtra",
    logo:"https://mytat.co/ats_clients_logo/inspacco-logo.webp",
    email:'email@inspacco.com'
  }:data?.society
  console.log("clientObj", clientObj)
  const [formData, setFormData] = useState({
    serviceCategory: data.service.name,
    serviceRequestId: data.objectId,
    srNo: data.displayId,
    externalReferenceNumber:
      requirementFieldsObj?.["Reference Number(External)"],
    srDate: moment().format("DD MMM YYYY"),
    quotationReceiverName: "Sir/Madam",
    note:
      readOnly && selectedQuotation.status === "OPEN"
        ? selectedQuotation.note
        : "",
    items: readOnly ? _formatItemsArr(selectedQuotation.items.edges) : [],
    actualAmount: readOnly ? selectedQuotation.actualAmount : 0,
    totalAmount: readOnly ? selectedQuotation.totalAmount : 0,
    discountApplicable: readOnly
      ? Number(selectedQuotation.discount) > 0
      : false,
    mgmtFeeApplicable: readOnly
      ? Number(selectedQuotation.otherCharges) > 0
      : true,
    discountPercent: readOnly ? selectedQuotation.discount : 0,
    managementFeePercent: readOnly ? selectedQuotation.otherCharges : 5,
    // otherCharges: readOnly ? selectedQuotation.otherCharges : 0,
    otherCharges: 0,
    discount: readOnly ? discountAmt : 0,
    taxPercent: 18,
    partner:
      readOnly && data.partner?.objectId
        ? { value: data.partner?.objectId, label: data.partner?.name }
        : null,
    tax: readOnly ? selectedQuotation.tax : 0,
    quotationValidityDays: "7",
    companyLogo: data.society.logo,
    branchCode: requirementFieldsObj?.["Unique Code"] || "N/A",
    addressHTML: `<h3><strong>${clientObj?.registeredEntityName}
</strong></h3>
    <br/>
    <p><strong>CIN No - </strong> ${clientObj?.CINNumber}</p>
    <br/>
    <p>${clientObj.addressLine1},</br>${
      clientObj.addressLine2 ? `${clientObj.addressLine2},` : ""
    }</p>
    <p>${clientObj.area},${clientObj.city}, ${clientObj.state}, ${
      clientObj.pincode
    }</p>
    <p><strong>Phone No : </strong>${
      clientObj?.POCMobileNumber
    }|<strong> Email : </strong>${clientObj.email}</p>
    <p><strong>GST No : </strong>${clientObj?.GSTNo}  </p>
    <p><strong>GST State : </strong>${clientObj?.GSTState}  </p>`,
    // | <strong>GST State: </strong>${
    //   data.society.state
    // } (${gstNo.substr(0, 2)})</p>`,
  });

  useEffect(() => {
    let mgmtFeeAmt = 0;
    // formData.mgmtFeeApplicable && formData.managementFeePercent > 0
    //   ? _calculatePercentage(
    //       formData.actualAmount,
    //       formData.managementFeePercent
    //     )
    //   : 0;
    let discountAmt = 0;
    if (formData.discountApplicable && formData.discountPercent > 0) {
      discountAmt = _calculatePercentage(
        Number(formData.actualAmount) + Number(mgmtFeeAmt),
        formData.discountPercent
      );
    }

    setFormData({
      ...formData,
      discount: discountAmt,
      // otherCharges: mgmtFeeAmt,
      totalAmount: (
        Number(formData.actualAmount) +
        Number(mgmtFeeAmt) -
        Number(discountAmt) +
        Number(formData.tax)
      ).toFixed(2),
    });
  }, [
    formData.discountApplicable,
    formData.mgmtFeeApplicable,
    formData.discountPercent,
    formData.managementFeePercent,
  ]);

  return (
    <div
      className={`grid ${
        mode === "EDIT" ? "grid-cols-2" : "grid-cols-1"
      } gap-2 mb-4`}
    >
      {mode === "EDIT" && (
        <CreateNewQuotationForm
          {...{
            data,
            formData,
            setFormData,
            selectedQuotation,
            selectedServicePartners,
            mode,
          }}
        />
      )}
      <div
        className={`px-4 pdf-container ${
          mode === "READ_ONLY" ? "w-[50%] mx-auto" : ""
        }`}
      >
        <PDFViewComponent
          data={formData}
          mode={mode}
          selectedService={data}
          selectedQuotation={selectedQuotation}
          readOnly={readOnly}
          onCloseCallback={onCloseCallback}
          onSubmit={onSubmit}
        />
        {selectedQuotation.status === "REJECTED" && mode === "READ_ONLY" && (
          <div className="">
            <Separator>Quotation Rejection Reason</Separator>
            <ChatBubble side="start">
              <ChatBubble.Header className="text-xs">Client</ChatBubble.Header>
              <ChatBubble.Message>{selectedQuotation.note}</ChatBubble.Message>
            </ChatBubble>
          </div>
        )}
      </div>
    </div>
  );
}

const PDFViewComponent = ({
  readOnly,
  selectedQuotation,
  selectedService,
  onCloseCallback,
  mode,
  onSubmit,
  data: {
    quotationReceiverName,
    srDate,
    srNo,
    branchCode,
    externalReferenceNumber,
    serviceCategory,
    companyLogo,
    items = [],
    managementFeePercent,
    discountPercent,
    taxPercent,
    actualAmount,
    totalAmount,
    quotationValidityDays,
    addressHTML,
    serviceRequestId,
    mgmtFeeApplicable,
    discountApplicable,
    note,
    discount,
    otherCharges,
    tax,
    partner,
  },
}) => {
  const pdfRef = useRef();
  const { isAdmin } = useSelector((store) => store.authSlice);

  const [companyLogoURI, setCompanyLogoDataURI] = useState(null);
  const [showReviseQuotationConfirmation, setShowReviseQuotationConfimation] =
    useState(false);
  const [clientNote, setClientNote] = useState("");
  const [isQuotationSubmitInProgress, setIsQuotationSubmitInProgress] =
    useState(false);
  const [createServiceQuotation] = useMutation(CREATE_SERVICE_QUOTATION);
  const [updateServiceQuotation] = useMutation(
    UPDATE_SERVICE_QUOTATION_STATUS_BY_ID
  );
  // const [updateServiceRequestStatus] = useMutation(
  //   UPDATE_SERVICE_REQUEST_STATUS_BY_ID
  // );

  useEffect(() => {
    convertImgToDataURI(getFileUrl(companyLogo)).then((uri) =>
      setCompanyLogoDataURI(uri)
    );
  }, []);

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [canvas.width, canvas.height],
        compress: true,
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(
        `${selectedService.society.name}_SR#${
          selectedService.displayId
        }_Quote#${selectedQuotation.index}_${moment().format("DD_MM_YY")}.pdf`
      );
    });
  };

  const _getStatusValueFrom = (arr, target) =>
    arr.find(({ value }) => value === target)?.value;

  const _onAdminSubmitQuotation = async () => {
    onCloseCallback();
    const itemsArray = items.map((item, index) => ({
      serialNumber: index + 1,
      serviceDescription: item.work_Description,
      rate: Number(item.rate),
      unit: item.unit,
      quantity: Number(item.qty),
      amount: Number(item.amount),
      isContractual:item?.isContractual,
      itemType: item.item_Type ? "Labour" : "Material",
      partnerRate: Number(item.partner_Rate),
    }));
    console.log("The quote details are :", itemsArray);
    // const itemsArray = _formatItemsArr(items);
    setIsQuotationSubmitInProgress(true);
    const toastId = toast.loading(
      `${
        selectedQuotation.objectId ? "Updating" : "Creating"
      } quotation, Please wait...`,
      {
        autoClose: false,
        type: toast.TYPE.INFO,
      }
    );
    // Need to create record with Quotation value in ServiceQuotation
    try {
      if (mode === "EDIT" && selectedQuotation.objectId) {
        await createServiceQuotation({
          variables: {
            id: serviceRequestId,
            actualAmount: actualAmount,
            totalAmount: Number(totalAmount),
            tax: Number(tax),
            otherCharges: mgmtFeeApplicable
              ? Number(managementFeePercent) || 0
              : 0,
            note: note || "",
            discount: discountApplicable ? Number(discountPercent) : 0,
            createAndAdd: itemsArray,
            quotationReceiverName,
            partner: partner.value,
          },
        });

        await updateServiceQuotation({
          variables: {
            id: selectedQuotation.objectId,
            status: _getStatusValueFrom(SERVICE_QUOTATION_STATUS, "DELETED"),
          },
        });
      } else {
        await createServiceQuotation({
          variables: {
            id: serviceRequestId,
            actualAmount: actualAmount,
            totalAmount: Number(totalAmount),
            tax: Number(tax),
            otherCharges: mgmtFeeApplicable
              ? Number(managementFeePercent) || 0
              : 0,
            note: note || "",
            discount: discountApplicable ? Number(discountPercent) : 0,
            createAndAdd: itemsArray,
            quotationReceiverName,
            partner: {
              link: partner.value,
            },
          },
        });
      }
      // Change Status of Service Reqeust to Quotation Approval Pending
      onSubmit({
        status: _getStatusValueFrom(
          SERVICE_REQUEST_STATUS_OPTIONS,
          "QUOTATION_APPROVAL_PENDING"
        ),
        partner: { link: partner.value },
      });
      // await updateServiceRequestStatus({
      //   variables: {
      //     id: serviceRequestId,
      //     status: _getStatusValueFrom(
      //       SERVICE_REQUEST_STATUS_OPTIONS,
      //       "QUOTATION_APPROVAL_PENDING"
      //     ),
      //   },
      // });
      // update toast
      toast.update(toastId, {
        render: `Quotation ${
          selectedQuotation.objectId ? "Updated" : "Created"
        } Successfully!`,
        isLoading: false,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error submitting quotation:", error);
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        isLoading: false,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    } finally {
      setIsQuotationSubmitInProgress(false);
    }
  };

  const showPriceBreakdown = () => {
    const fields = [
      {
        label: "Total Amount",
        value:
          isAdmin || !readOnly ? actualAmount : selectedQuotation.actualAmount,
        formatter: "₹",
        labelClass:'text-xs'
      },
      // {
      //   // label: `Service Charges (${managementFeePercent}%)`,
      //   label: `Management Fee (${managementFeePercent}%)`,
      //   value:
      //     isAdmin || !readOnly ? otherCharges : selectedQuotation.otherCharges,
      //   formatter: `+ ₹`,
      // },
      // {
      //   label: `Discount (${discountPercent}%)`,
      //   value: isAdmin || !readOnly ? discount : selectedQuotation.discount,
      //   formatter: `- ₹`,
      // },
      // {
      //   label: `Tax (${taxPercent}%)`,
      //   value: isAdmin || !readOnly ? tax : selectedQuotation.tax,
      //   formatter: `+ ₹`,
      // },
      // {
      //   label: ``,
      //   formatter: "_",
      //   value: `_______`,
      // },
      // {
      //   label: `Total Amount`,
      //   formatter: "₹",
      //   value:
      //     isAdmin || !readOnly ? totalAmount : selectedQuotation.totalAmount,
      // },
    ];
    if(isContractualOption){
      const contrctualAmount = items?.filter(obj=>obj?.isContractual).reduce((sum, item) => sum + item.amount, 0);
      const nonContrctualAmount = items?.filter(obj=>!obj?.isContractual).reduce((sum, item) => sum + item.amount, 0);
      fields.unshift({
        label: "Non-Rate Contract Total",
        value: nonContrctualAmount,
        formatter: "₹",
      });
      fields.unshift({
        label: "Rate Contract Total",
        value: contrctualAmount,
        formatter: "₹",
      });
    }
    console.log('===fields',fields)
    return (
      <div className="grid grid-cols-3">
        {fields
          .filter(
            ({ label, value, formatter }) =>
              value > 0 || formatter == "_" || label === "Total Amount"
          )
          .map(({ label, value, formatter ,labelClass=''}, index) => (
            <Fragment key={index}>
              <div className={`col-span-2 w-max ${labelClass}`}  >{label}</div>
              <div className={`text-right ${labelClass}`}>
                {formatter}
                {value}
              </div>
            </Fragment>
          ))}
      </div>
    );
  };

  const _onClientApproveQuotation = async () => {
    setIsQuotationSubmitInProgress(true);
    onCloseCallback();
    const toastId = toast.loading("Approving quotation, Please wait...", {
      autoClose: false,
      type: toast.TYPE.INFO,
    });
    // Schema: ServiceQuotation new Record with default Status -> Open
    await updateServiceQuotation({
      variables: {
        id: selectedQuotation.objectId,
        status: _getStatusValueFrom(SERVICE_QUOTATION_STATUS, "ACCEPTED"),
      },
    });
    // Change Status of Service Reqeust to Quotation Approved
    onSubmit({
      status: _getStatusValueFrom(
        SERVICE_REQUEST_STATUS_OPTIONS,
        "QUOTATION_APPROVED"
      ),
    });
    // await updateServiceRequestStatus({
    //   variables: {
    //     id: serviceRequestId,
    //     status: _getStatusValueFrom(
    //       SERVICE_REQUEST_STATUS_OPTIONS,
    //       "QUOTATION_APPROVED"
    //     ),
    //   },
    // });
    // update toast
    toast.update(toastId, {
      render: `Quotation Approved Successfully!`,
      isLoading: false,
      type: toast.TYPE.SUCCESS,
      autoClose: 5000,
    });
    setIsQuotationSubmitInProgress(false);
  };

  const _onClientReviseQuotation = async (note) => {
    setIsQuotationSubmitInProgress(true);
    onCloseCallback();
    const itemsArray = items.map((item, index) => ({
      serialNumber: index + 1,
      serviceDescription: item.work_Description,
      rate: Number(item.rate),
      unit: item.unit,
      quantity: Number(item.qty),
      amount: Number(item.amount),
      itemType: item.item_Type ? "Material" : "Labour",
      partnerRate: Number(item.partner_Rate),
    }));
    const toastId = toast.loading(
      "Sending quotation for revision, Please wait...",
      {
        autoClose: false,
        type: toast.TYPE.INFO,
      }
    );
    // ServiceQuotation Status -> Rejected
    await updateServiceQuotation({
      variables: {
        id: selectedQuotation.objectId,
        note: clientNote || "",
        status: _getStatusValueFrom(SERVICE_QUOTATION_STATUS, "REJECTED"),
      },
    });
    const quotationBody = {
      id: serviceRequestId,
      quotationReceiverName: selectedQuotation.quotationReceiverName,
      actualAmount: Number(selectedQuotation.actualAmount),
      totalAmount: Number(selectedQuotation.totalAmount),
      tax: Number(selectedQuotation.tax),
      otherCharges: Number(selectedQuotation.otherCharges) || 0,
      note: "",
      discount: Number(selectedQuotation.discount),
      createAndAdd: itemsArray,
    };
    // Need to create new Quotation record in ServiceRequest
    await createServiceQuotation({
      variables: quotationBody,
    });
    // ServiceReqeust Status -> REVISED_QUOTATION_PENDING
    onSubmit({
      status: _getStatusValueFrom(
        SERVICE_REQUEST_STATUS_OPTIONS,
        "REVISED_QUOTATION_PENDING"
      ),
    });

    // update toast
    toast.update(toastId, {
      render: `Quotation Sent for revision Successfully!`,
      isLoading: false,
      type: toast.TYPE.SUCCESS,
      autoClose: 5000,
    });
    setIsQuotationSubmitInProgress(false);
  };
  const settings = selectedService?.society?.settings || {}
  console.log("settings Quotation form", settings)
  const isContractualOption = settings['IS_CONTRACTUAL_VS_NON_CONTRACTUAL_RATE_OPTION']
  return (
    <div>
      <div className="flex justify-end gap-2 mt-3 actions-bar">
        <Button
          type="outline"
          className="gap-2 mb-2 btn-sm"
          onClick={downloadPDF}
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          Download PDF
        </Button>
        {((isAdmin && selectedQuotation.status === "OPEN") || !readOnly) && (
          <Button
            type="accent"
            disabled={!items.length}
            className="gap-2 mb-2 btn-sm"
            onClick={_onAdminSubmitQuotation}
            loading={isQuotationSubmitInProgress}
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            Submit
          </Button>
        )}
      </div>
      <div
        ref={pdfRef}
        style={{
          backgroundColor: "white",
          paddingLeft: "70px",
          paddingRight: "70px",
          paddingTop: "60px",
          paddingBottom: "60px",
          border: "1px solid #ccc",
          managementFeePercentBottom: "5px",
          fontSize: "12px",
          color: "black",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div dangerouslySetInnerHTML={{ __html: addressHTML }}></div>
          <div>
            <img src={companyLogoURI} width={100} />
          </div>
        </div>

        <br />
        <div className="flex items-start justify-between">
          <p>
            <p className="font-semibold">To,</p>
            <p>{quotationReceiverName},</p>
            {/* <p>JLL,</p> */}
            {/* <p>For Works at IDFC Bank</p> */}
          </p>
          <p>
            <span className="font-semibold">Date </span>: {srDate}
          </p>
        </div>
        <br />
        <p>
          <span className="font-semibold">Branch Code</span> – {branchCode}
        </p>
        <p>
          <span className="font-semibold">Service Category</span> –{" "}
          {serviceCategory}
        </p>
        <p>
          <span className="font-semibold">Service Request No. </span> – {srNo}
        </p>
        <p>
          {" "}
          <span className="font-semibold">Ref </span>- {externalReferenceNumber}
        </p>
        {/* <p>
          {" "}
          <b>Date </b>: {srDate}
        </p> */}

        <br />
        <table
          className="border border-black text-[9px]"
          cellPadding="10"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead className="border border-black">
            <tr style={{ backgroundColor: "lightgrey" }}>
              <th className="border border-black">Sr.No</th>
              <th className="border border-black">Work Description</th>
              <th className="border border-black">Type</th>
              <th className="border border-black">Qty</th>
              <th className="border border-black">Unit</th>
              <th className="border border-black">Rate (₹)</th>
              {isContractualOption?<th className="border border-black">Rate Contract</th>:null}
              <th className="border border-black">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr>
                <td className="border border-black">{index + 1}</td>
                <td className="border border-black">
                  {item?.work_Description}
                </td>
                <td className="border border-black">
                  {item?.item_Type ? "Labour" : "Material"}
                </td>
                <td className="border border-black">{item?.qty}</td>
                <td className="border border-black">{item?.unit}</td>
                <td className="border border-black">{item?.rate}</td>
                {isContractualOption?<td className="border border-black">{item?.isContractual? 'Yes':'No'}</td>:null}
                <td className="text-right border border-black">
                  {item?.amount}
                </td>
              </tr>
            ))}

            <tr style={{ backgroundColor: "lightgrey" }}>
              <td colspan="4" className="text-center">
                {/* <b>Grand Total</b> */}
              </td>
              <td className="font-semibold" colspan="3">
                {showPriceBreakdown()}
              </td>
            </tr>
            {/* Additional rows can be added dynamically based on the data */}
          </tbody>
        </table>

        <br />

        <br />
        <span className="font-semibold">TERMS & CONDITIONS:</span>
        <p>
          <span className="font-semibold">Quotation Validity </span> –{" "}
          {quotationValidityDays} days from date of quotation
        </p>
        {mgmtFeeApplicable && (
          <p>
            {" "}
            <span className="font-semibold">Management Fee </span> (MF) – Extra
            @ {managementFeePercent}% on Total Amount Quoted
          </p>
        )}
        <p>
          {" "}
          <span className="font-semibold">Taxes </span> – GST Extra @{" "}
          {taxPercent}% on Total Amount Quoted
          {mgmtFeeApplicable && " + MF"}
        </p>
        <p>
          <span className="font-semibold">Work Completion Timeline </span> -
          Repair work will be completed immediately subject to availability of
          technician & materials. Lead time of materials may vary depending on
          stock availability & local holidays
        </p>
        <p>
          <span className="font-semibold">Additional Works </span> - Any
          additional works requested at site will be done after approval only
        </p>
      </div>
      {!isAdmin &&
        readOnly &&
        selectedQuotation.status === "OPEN" &&
        selectedService.status == "QUOTATION_APPROVAL_PENDING" && (
          <div className="flex flex-col gap-2 mt-4 client-footer-actions">
            <div className="flex-none pb-6 text-sm border-b border-gray-600">
              <Separator>Note</Separator>
              {selectedQuotation.note ? (
                <ChatBubble side="start">
                  <ChatBubble.Header className="text-xs">
                    Inspacco Admin
                  </ChatBubble.Header>
                  <ChatBubble.Message>
                    {selectedQuotation.note}
                  </ChatBubble.Message>
                </ChatBubble>
              ) : (
                <EmptyData msg="No Notes!" />
              )}
            </div>
            <div className="inline-flex gap-3">
              <Button
                type="success"
                className="gap-2 mb-2 btn-outline btn-sm"
                onClick={_onClientApproveQuotation}
                loading={isQuotationSubmitInProgress}
              >
                <DocumentCheckIcon className="w-4 h-4" />
                Approve Quotation
              </Button>
              <Button
                type="warning"
                className="gap-2 mb-2 btn-outline btn-sm"
                onClick={() => setShowReviseQuotationConfimation(true)}
                loading={isQuotationSubmitInProgress}
              >
                <ReceiptRefundIcon className="w-4 h-4" />
                Revise Quotation
              </Button>
            </div>
          </div>
        )}
      <ConfirmationBox
        isOpen={showReviseQuotationConfirmation}
        className="w-[50%]"
        confirmDisabled={clientNote.length > 5 && clientNote.trim() === ""}
        message={
          <>
            <div className="flex items-center justify-center gap-2 mb-4">
              <ReceiptRefundIcon className="w-8 h-8 text-error" />
              <Text className="text-lg font-semibold">
                Send back Quotation for Revision?
              </Text>
            </div>
            <div className="w-[80%] mx-auto">
              <DynamicField
                field={{
                  type: "TEXTAREA",
                  name: "note",
                  label:
                    "Please describe your reason for sending quotation back for revision.",
                  placeholder: "reason",
                  value: clientNote,
                  setData: (obj) => setClientNote(obj.note),
                }}
              />
            </div>
          </>
        }
        onConfirm={() => {
          _onClientReviseQuotation();
          setShowReviseQuotationConfimation(false);
        }}
        onCancel={() => {
          setClientNote("");
          setShowReviseQuotationConfimation(false);
        }}
      />
    </div>
  );
};
