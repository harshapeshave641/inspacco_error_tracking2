import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { toast } from "react-toastify";
import Select from "../../components/common/neomorphic/Select";
import Input from "../../components/common/neomorphic/Input";
import Button from "../../components/common/neomorphic/Button";
import { CREATE_SERVICE_REQUEST } from "../../graphql/mutations/serviceRequest/createServiceRequest";
import { pickupDataFromResponse } from "../../helpers/utils";
import { priorityOptions, serviceSubServices } from "../../constants";
import UploadManager from "../../components/common/DocumentManager/UploadManager";
import { CREATE_ATTCHMENT } from "../../graphql/mutations/attachment/createAttachment";
import { SEARCH_FACILITY_BY_UNIIQUECODE } from "../../graphql/queries/clientfacility";
import { GET_SERVICE_PARTNERS } from "../../graphql/queries/partners";

const initialForm = {
  scopeOfWork: null, // !ID
  address: null, // !ID
  targetPricing: null, //String!
};

const CreateNewSRForm = ({
  onCloseCallback,
  services = [],
  societies,
  isAdminPage = false,
  selectedSociety = {},
}) => {
  const { user } = useSelector((state) => state.authSlice);
  const photoManagerRef = useRef(null);

  const [formData, setFormData] = useState(initialForm);
  const [attachmentsRes, setAttachmentRes] = useState([]);
  const [selectedServicePartners, setSelectedServicePartners] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createServiceRequest] = useMutation(CREATE_SERVICE_REQUEST);
  const [saveAttachment] = useMutation(CREATE_ATTCHMENT);

  const [searchClientFacilityByUniqueCode] = useLazyQuery(
    SEARCH_FACILITY_BY_UNIIQUECODE
  );
  const [getPartnersData] = useLazyQuery(GET_SERVICE_PARTNERS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const partnersData = pickupDataFromResponse({ data }).map(
        ({ name, objectId }) => ({ value: objectId, label: name })
      );
      setSelectedServicePartners(partnersData);
    },
  });

  const _handleCreateNewSR = async () => {
    const requirement = [
      {
        group: "G1",
        fields: [
          {
            label: "Scope Of Work",
            name: "scopeOfWork",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: formData.scopeOfWork,
          },
          {
            label: "Address",
            name: "societyAddress",
            isRequired: true,
            type: "TEXTAREA",
            value: formData.address,
          },
          {
            label: "Pincode",
            name: "pincode",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: formData.pincode,
          },
          {
            label: "City",
            name: "city",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: formData.city,
          },
          {
            label: "State",
            name: "state",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: formData.state,
          },
          {
            label: "Facility Name",
            name: "facilityName",
            isRequired: true,
            type: "DYNAMICTEXT",
            value: formData.facilityName,
          },
          {
            label: "Budget Allocated",
            name: "targetPricing",
            isRequired: true,
            type: "TEXTAREA",
            value: formData.targetPricing,
          },
          {
            label: "Unique Code",
            name: "uniqueCode",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: formData.uniqueCode,
          },
          {
            label: "POC Name",
            name: "pocName",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: formData.pocName,
          },
          {
            label: "POC Mobile Number",
            name: "mobileNumber",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: formData.mobileNumber,
          },
          {
            label: "POC Email",
            name: "email",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: formData.email,
          },
          {
            label: "Reference Number(External)",
            name: "referenceNumber",
            isRequired: false,
            type: "DYNAMICTEXT",
            value: formData.referenceNumber,
          },
        ],
      },
      setLoading(true),
    ];
    console.log("the new created data is :", requirement);
    console.log("formData", formData);
    const inputFields = {
      requester: {
        link: user.objectId,
      },
      service: {
        link: formData?.service?.value,
      },
      status: "TO_BE_WORKED_UPON",
      subService: formData?.subService?.value || "",
      priority:
        typeof formData?.priority === "object"
          ? formData?.priority?.value
          : formData.priority,
      requirement: JSON.stringify(requirement),
      referralCode: formData.referralCode,
    };
    if (isAdminPage) {
      inputFields.society = {
        link: formData.society.value,
      };
      inputFields.partner = {
        link: formData.partner?.value,
      };
    } else {
      inputFields.society = {
        link: selectedSociety?.objectId,
      };
    }
    const createServiceRequestRes = await createServiceRequest({
      variables: {
        input: {
          fields: inputFields,
        },
      },
    });
    console.log("createServiceRequestRes", createServiceRequestRes);
    onCloseCallback();
    const serviceRequestId =
      createServiceRequestRes?.data?.createServiceRequest?.serviceRequest
        ?.objectId;
    // return;
    let permissionGroupId = `INSPACC_ADMIN_ATTACHMENTS_${serviceRequestId}`;
    for await (const photo of attachmentsRes) {
      const attachmentData = {
        fileName: photo.imageName,
        url: photo?.uploadedFile.data.createFile.fileInfo.name,
        parentId: serviceRequestId,
        status: "Active",
        name: photo.imageName,
        module: "SERVICE_REQUEST_CREATION_ATTACHMENT", // 'Service_Task_Photos',
        permissionGroupId, // `SOCIETY_${societyId}`,
      };
      const save = await saveAttachment({ variables: attachmentData });
    }
  };

  let onChangeDebounceForUniqueCode = useCallback(
    _debounce(async (formData) => {
      let ifscode = formData?.uniqueCode;
      if (!ifscode) return;
      console.log("formdata", formData);

      let societyName = isAdminPage
        ? formData?.society?.label
        : selectedSociety?.name;
      const clientFacilityRes = await searchClientFacilityByUniqueCode({
        variables: {
          uniqueCode: ifscode,
          clientId: isAdminPage
            ? formData?.society?.value
            : selectedSociety?.objectId,
        },
      });

      console.log(
        "clientFacilityRes",
        pickupDataFromResponse({ data: clientFacilityRes?.data })
      );
      const clientFacilities = pickupDataFromResponse({
        data: clientFacilityRes?.data,
      });
      if (clientFacilities?.length > 0) {
        const {
          state,
          city,
          pincode,
          address,
          name,
          POCName,
          POCMobileNumber,
          POCEmail,
        } = clientFacilities[0];
        // let address = `${obj.BRANCH},${obj.ADDRESS}`;
        // let state = obj?.STATE;
        // let city = obj?.CITY;
        // let facilityName = obj?.BRANCH;
        // let pincode = extractPincode(address);
        setFormData({
          ...formData,
          includeAddress: true,
          address,
          pincode,
          city,
          state,
          facilityName: name,
          uniqueCode: ifscode,
          mobileNumber: POCMobileNumber,
          pocName: POCName,
          email: POCEmail,
        });
      }

      // fetchBankDetails(ifscode, societyName)
      //   .then((obj) => {
      //     let address = `${obj.BRANCH},${obj.ADDRESS}`;
      //     let state = obj?.STATE;
      //     let city = obj?.CITY;
      //     let facilityName = obj?.BRANCH;
      //     let pincode = extractPincode(address);
      //     setFormData({
      //       ...formData,
      //       includeAddress: true,
      //       address,
      //       pincode,
      //       city,
      //       state,
      //       facilityName,
      //       uniqueCode: ifscode,
      //     });
      //   })
      //   .catch((err) => {
      //     console.error("Error Pincode", err);
      //   });
    }, 400),
    []
  );

  useEffect(() => {
    onChangeDebounceForUniqueCode(formData);
  }, [formData?.uniqueCode]);

  useEffect(() => {
    getPartnersData({
      variables: {
        serviceName: formData.service?.label,
      },
    });
  }, [formData.service?.value]);

  useEffect(() => {
    if (formData?.subService?.priority)
      setFormData({ ...formData, priority: formData?.subService?.priority });
  }, [formData?.subService]);

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

  function validateServiceRequest(fn) {
    if (!formData?.service?.value) {
      toast.error("Please Select Service");
      return false;
    }
    if (!formData?.priority) {
      toast.error("Please Select Priority Email");
      return false;
    }
    if (!formData?.scopeOfWork) {
      toast.error("Please Enter Scope Of Work");
      return false;
    }
    if (!formData?.pincode) {
      toast.error("Please Enter Pincode");
      return false;
    }
    if (!formData?.mobileNumber) {
      toast.error("Please Enter Mobile Number");
      return false;
    }
    if (!formData?.pocName) {
      toast.error("Please Enter POC Name");
      return false;
    }
    fn();
    toast.success(`Service Request Created Successfully!`);
  }

  return (
    <div className="flex flex-col items-center pt-4 mx-6 mb-20 overflow-y-auto gap-y-4">
      {isAdminPage ? (
        <>
          <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
            <label className="pb-1 text-lg font-medium label-text">
              Client <span className="text-red-500">*</span>
            </label>
            <div className=" form-control sm:w-full md:w-full lg:w-1/10">
              <Select
                placeholder={"Client"}
                native={false}
                menuPortalTarget="body"
                className={"w-full"}
                onChange={(v) => {
                  setFormData({ ...formData, society: v });
                }}
                options={societies?.map((society) => {
                  return {
                    label: society.name,
                    value: society.objectId,
                  };
                })}
                value={formData.society}
              />
            </div>
          </div>
        </>
      ) : null}
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Service <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Select
            placeholder={"Service"}
            native={false}
            className={"w-full"}
            menuPortalTarget="body"
            onChange={(v) => {
              setFormData({ ...formData, service: v });
            }}
            options={services}
            value={formData.service}
          />
        </div>
      </div>
      {isAdminPage && (
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text">
            Vendor {/* <span className="text-red-500">*</span> */}
          </label>
          <div className=" form-control sm:w-full md:w-full lg:w-1/10">
            <Select
              placeholder={"Vendor"}
              native={false}
              menuPortalTarget="body"
              className={"w-full"}
              onChange={(v) => setFormData({ ...formData, partner: v })}
              options={selectedServicePartners}
              value={formData.partner}
            />
          </div>
        </div>
      )}
      {subServiceOptions?.length ? (
        <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
          <label className="pb-1 text-lg font-medium label-text">
            Sub Service
          </label>
          <div className=" form-control sm:w-full md:w-full lg:w-1/10">
            <Select
              disabled={!formData.service}
              placeholder={"Sub Service"}
              native={false}
              className={"w-full"}
              menuPortalTarget="body"
              onChange={(v) => {
                setFormData({ ...formData, subService: v });
              }}
              options={subServiceOptions}
              value={formData.subService}
            />
          </div>
        </div>
      ) : null}
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text text-accent">
          Priority <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Select
            options={priorityOptions}
            native={false}
            onChange={(value) => setFormData({ ...formData, priority: value })}
            value={formData.priority}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Scope Of Work <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <textarea
            name="scopeOfWork"
            label="Scope Of Work"
            className="w-full textarea textarea-bordered textarea-md "
            value={formData.scopeOfWork}
            onChange={({ target: { value } }) =>
              setFormData({ ...formData, scopeOfWork: value })
            }
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Facility Unique Code
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Unique Code"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, uniqueCode: e.target.value })
            }
            value={formData.uniqueCode}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="option1"
            name="option1"
            className="checkbox checkbox-primary"
            checked={formData.includeAddress}
            onChange={(e) => {
              setFormData({ ...formData, includeAddress: e.target.checked });
            }}
          />
          <label htmlFor="option1">Include Address</label>
        </div>
        {formData.includeAddress ? (
          <div>
            <label className="pb-1 text-lg font-medium label-text">
              Address
            </label>
            <textarea
              name="address"
              label="Address"
              className="w-full textarea textarea-bordered textarea-md "
              value={formData.address}
              onChange={({ target: { value } }) =>
                setFormData({ ...formData, address: value })
              }
            />
          </div>
        ) : null}
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Facility Name
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter  Facility Name"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, facilityName: e.target.value })
            }
            value={formData.facilityName}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Pincode<span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            maxLength={6}
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter Pincode"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
            value={formData.pincode}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">City</label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter your City"
            type="text"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            value={formData.city}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">State</label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter State"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            value={formData.state}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          POC Name<span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter POC Name"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, pocName: e.target.value })
            }
            value={formData.pocName}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          POC Email ID
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter your email address"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          POC Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            maxLength={10}
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter your Mobile Number"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            value={formData.mobileNumber}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="text-lg label-text font-medium1pb-1">
          Budget Allocated
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter your Target Price"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, targetPricing: e.target.value })
            }
            value={formData.targetPricing}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <label className="pb-1 text-lg font-medium label-text">
          Reference Number(External)
        </label>
        <div className=" form-control sm:w-full md:w-full lg:w-1/10">
          <Input
            // prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
            className={"input-sm"}
            placeholder="Enter Your Reference Number"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, referenceNumber: e.target.value })
            }
            value={formData.referenceNumber}
          />
        </div>
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <UploadManager ref={photoManagerRef} onUploadDone={setAttachmentRes} />
      </div>
      <div className="mx-6 form-control sm:w-full md:w-full lg:w-1/2">
        <div className="text-right">
          <Button
            loading={loading}
            onClick={() => {
              validateServiceRequest(_handleCreateNewSR);
              //   onSubmitCallback();
            }}
            type="accent"
          >
            Submit
          </Button>
          &nbsp;&nbsp;
          <Button type="default" onClick={onCloseCallback}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateNewSRForm;
