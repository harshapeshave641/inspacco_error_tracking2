import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

import { CREATE_SERVICE_REQUEST } from "../../../../graphql/mutations/serviceRequest/createServiceRequest";
import { GET_SERVICE_BY_ID } from "../../../../graphql/queries/getServiceById";
import View from "../../../common/View";
import Input from "../../../common/neomorphic/Input";
import Button from "../../../common/neomorphic/Button";

export default function ServiceRequestScheduleVisitForm({
  serviceId,
  data,
  setData,
  closeScheduleVisitModal,
}) {
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: data.visitDataTime,
    endDate: data.visitDataTime,
  });

  const {
    user: { objectId: currentUserId },
    activeAccountId,
  } = useSelector((state) => state.authSlice);

  const [createServiceRequest] = useMutation(CREATE_SERVICE_REQUEST);

  const _handleDatePickerValueChange = (value) => {
    setData({ ...data, visitDataTime: value.startDate });
    setDateRange(value);
  };

  // const showDatePicker = () => setDatePickerVisibility(true);

  // const hideDatePicker = () => setDatePickerVisibility(false);

  async function scheduleVisit() {
    if (!data.visitDataTime) {
      toast.error("Please choose visit date & time");
    } else if (!data.requirement) {
      toast.error("Please Provide requirment");
    } else {
      const inputFields = {
        requester: {
          link: currentUserId,
        },
        service: {
          link: serviceId,
        },
        status: "OPEN",
        visitDate: moment(data.visitDataTime).toDate(),
        visitRequirement: {
          societyName: data.societyName,
          societyAddress: data.societyAddress,
          requirement: data.requirement,
        },
      };

      if (activeAccountId) {
        inputFields.society = {
          link: activeAccountId,
        };
      }

      await createServiceRequest({
        variables: {
          input: {
            fields: inputFields,
          },
        },
      });

      closeScheduleVisitModal();

      toast.success(
        "Your request for visit has been submitted. A Partner will be assigned to visit your society"
      );
    }
  }

  return (
    <>
      <div>
        <View className="w-[60%] pt-6 flex flex-col gap-2 mx-auto px-1">
          <div>
            <label className="label-text text-lg font-medium pb-1 text-accent">
              Client Name
            </label>
            <div className="form-control sm:w-full md:w-full lg:w-1/10">
              <Input
                name="societyName"
                disabled
                value={data.societyName}
                onChange={({ target: { value } }) =>
                  setData({ ...data, societyName: value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label-text text-lg font-medium pb-1 text-accent">
              Client Address
            </label>
            <div className="form-control sm:w-full md:w-full lg:w-1/10">
              <textarea
                name="societyAddress"
                label="Client Address"
                className="textarea textarea-bordered textarea-md w-full "
                value={data.societyAddress}
                onChange={({ target: { value } }) =>
                  setData({ ...data, societyAddress: value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label-text text-lg font-medium pb-1 text-accent">
              Requirement
            </label>
            <div className="form-control sm:w-full md:w-full lg:w-1/10">
              <textarea
                name="requirement"
                label="Requirement"
                className="textarea textarea-bordered textarea-md w-full "
                value={data.requirement}
                onChange={({ target: { value } }) =>
                  setData({ ...data, requirement: value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label-text text-lg font-medium pb-1 text-accent">
              Visit Date
            </label>
            <div className="form-control sm:w-full md:w-full lg:w-1/10">
              <div className="flex items-center gap-4">
                <Datepicker
                  asSingle={true}
                  containerClassName=""
                  value={dateRange}
                  useRange={false}
                  showShortcuts={false}
                  theme={"light"}
                  minDate={new Date(moment().subtract(1, "days"))}
                  inputClassName="text-base-content input input-bordered w-72"
                  popoverDirection={"up"}
                  onChange={_handleDatePickerValueChange}
                  primaryColor={"white"}
                />
                <div>
                  {data.visitDataTime
                    ? moment(new Date(data.visitDataTime)).format("lll")
                    : "Choose Date & Time"}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right py-4">
            <Button type="accent" onClick={scheduleVisit}>
              Schedule Visit
            </Button>
          </div>
        </View>
      </div>
    </>
  );
}
