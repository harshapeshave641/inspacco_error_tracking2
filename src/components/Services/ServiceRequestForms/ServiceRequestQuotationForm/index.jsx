import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import {
  GET_SOCIETIES,
  getSocietyMemberSubquery,
} from "../../../../graphql/queries/getSocieties";
import { CREATE_SERVICE_REQUEST } from "../../../../graphql/mutations/serviceRequest/createServiceRequest";

import { ROLES } from "../../../../constants";

import DynamicField from "../../../common/DynamicField";
import Button from "../../../common/neomorphic/Button";
import View from "../../../common/View";
import Separator from "../../../common/Separator";
import LabelValue from "../../../common/LabelValue";

const ServiceRequestQuotationForm = ({
  setData,
  data,
  groups,
  serviceId,
  closeEnquiryModal,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  let [societiesData, setSocietiesData] = useState([]);
  let [reviewing, setReviewing] = useState(false);

  const {
    user: { objectId: currentUserId },
    activeAccountId,
    activeRole,
  } = useSelector((state) => state.authSlice);

  const [createServiceRequest] = useMutation(CREATE_SERVICE_REQUEST);
  const { roles } = useSelector((state) => state.authSlice);

  // const [getSocitiesIds] = useLazyQuery(GET_SOCIETIES_BY_SOCIETY_IDS);

  // const fetchSocities = async () => {
  //   const socitiesResponse = await getSocitiesIds({
  //     variables: {
  //       societyIds: [...roles?.map((role) => role.activeAccountId)],
  //     },
  //   });
  //   const socs = pickupDataFromResponse(socitiesResponse) || [];
  //   console.log('socs',socs);
  // }
  const [getSocieties, { data: societyData }] = useLazyQuery(GET_SOCIETIES, {
    skip:
      activeRole === ROLES.SOCIETY_ADMIN ||
      activeRole === ROLES.SOCIETY_MANAGER ||
      activeRole === ROLES.PARTNER_ADMIN,
    onCompleted: (data) => setSocietiesData(data),
    variables: {
      memberSubquery:
        activeRole === ROLES.INSPACCO_KAM
          ? getSocietyMemberSubquery(currentUserId, activeRole)
          : activeRole === ROLES.INSPACCO_CDA
          ? getSocietyMemberSubquery(currentUserId, activeRole)
          : {},
    },
  });

  // console.log("inside dyamic field", societyData);

  useEffect(() => {
    getSocieties();
  }, []);

  async function handleSubmitServiceRequest(data) {
    const requirement = groups.map((group) => {
      return {
        ...group,
        fields: group.fields.map((field) => {
          return {
            ...field,
            value: data[field.name],
          };
        }),
      };
    });

    const inputFields = {
      requester: {
        link: currentUserId,
      },
      service: {
        link: serviceId,
      },
      status: "OPEN",
      requirement: JSON.stringify(requirement),
      referralCode: data.referralCode,
    };

    if (activeAccountId || data?.societyId) {
      inputFields.society = {
        link: activeAccountId || data?.societyId,
      };
    }

    await createServiceRequest({
      variables: {
        input: {
          fields: inputFields,
        },
      },
    });

    closeEnquiryModal();

    toast.success("Your request for quotation has been sent.");
  }

  const onPrevClick = () => setActiveStep((prev) => prev - 1);

  const onNextClick = () => setActiveStep((prev) => prev + 1);

  const onRequirementFilled = () => setReviewing(true);

  return (
    <div className="w-[60%] mx-auto px-1 flex flex-col gap-y-4 overflow-y-auto mt-4">
      {!reviewing ? (
        <>
          {groups[activeStep]?.fields.map((field) => {
            return (
              <DynamicField
                societyData={societiesData}
                field={field}
                key={field.name}
                data={data}
                setData={setData}
              />
            );
          })}
          <div className="flex justify-between">
            <Button
              type="outline"
              disabled={activeStep === 0}
              onClick={onPrevClick}
            >
              Prev
            </Button>
            {activeStep === groups.length - 1 ? (
              <Button type="accent" onClick={onRequirementFilled}>
                Review
              </Button>
            ) : (
              <Button onClick={onNextClick} type="accent">
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <div>
          <ReviewServiceRequirements
            formGroups={groups}
            formValues={data}
            onSubmit={handleSubmitServiceRequest}
          />
        </div>
      )}
    </div>
  );
};

export default ServiceRequestQuotationForm;

const ReviewServiceRequirements = ({ formGroups, formValues, onSubmit }) => {
  let [submitClicked, setSubmitClicked] = useState(false);

  function getValue(value, type) {
    if (type === "BOOLEAN") return value ? "Yes" : "No";
    if (["DYNAMICTEXT", "LIST"].includes(value)) return value.label;
    return value;
  }

  const formFields = [];
  formGroups.forEach(({ fields }) => {
    fields.forEach(({ label, name, type }) => {
      formFields.push({
        label,
        value: isEmpty(formValues[name])
          ? "-"
          : getValue(formValues[name], type),
      });
    });
  });

  const _handleSubmitClick = () => {
    setSubmitClicked(true);
    onSubmit();
  };

  return (
    <div>
      <View>
        <Text className="text-xl">Review Your Requirements</Text>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          {formFields.map(({ label, value }, index) => {
            return <LabelValue label={label} value={value} />;
          })}
        </div>
        <div className="justify-center flex pt-8">
          <Button
            type="accent"
            onClick={_handleSubmitClick}
            disabled={submitClicked}
          >
            Submit
          </Button>
        </div>
      </View>
    </div>
  );
};
