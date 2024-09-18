import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import env from "../../../env";

import Button from "../../common/neomorphic/Button";
import Separator from "../../common/Separator";
import View from "../../common/View";
import Text from "../../common/Typography/Text";

import QualityAssurance from "../QualityAssurance";
import HowItWorks from "../HowItWorks";

import { GET_SERVICE_BY_ID } from "../../../graphql/queries/getServiceById";

import Modal from "../../common/Modal";

import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ServiceRequestQuotationForm from "../ServiceRequestForms/ServiceRequestQuotationForm";
import ServiceRequestScheduleVisitForm from "../ServiceRequestForms/ServiceRequestScheduleVisitForm";
import moment from "moment";

export default function PopularServiceDetail(props) {
  const { activeSociety } = useSelector((state) => state.authSlice);
  let [showEnquiryModal, setShowEnquiryModal] = useState(false);
  let [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);

  let [requestQuoteData, setRequestQuoteData] = useState({});
  const [scheduleVisitData, setScheduleVisitData] = useState({
    visitDataTime: moment().add(2, "day").toISOString(),
    societyName: activeSociety.name,
    societyAddress: `${activeSociety?.addressLine1}, ${activeSociety?.addressLine2},${activeSociety?.area},${activeSociety?.city}-${activeSociety?.pincode}`,
  });

  const { data: serviceData } = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      id: props.id,
    },
  });

  const groups = serviceData?.service?.requirementForm
    ? JSON.parse(serviceData.service.requirementForm)
    : [];

  const getServiceThumbnail = (serviceKey) => {
    return `${env.host}/public/images/services/${serviceKey}/thumbnail.jpg`;
  };

  const _closeScheduleVisitModal = () => setShowScheduleVisitModal(false);
  const _closeEnquiryTypeModal = () => setShowEnquiryModal(false);

  return (
    <div>
      <div>
        <img
          className="rounded-2xl w-[-webkit-fill-available]"
          src={getServiceThumbnail(props.serviceKey)}
        />
        <div className="px-4">
          <View className="pt-4">
            <div>
              <Text className="text-xl font-medium text-accent">
                {serviceData?.service?.name}
              </Text>
            </div>
            <Text className="text-xs">
              {serviceData?.service?.description || "-"}
            </Text>
          </View>
          <Separator />
          <View>
            <HowItWorks />
          </View>
          <Separator />
          <View>
            <QualityAssurance
              data={
                serviceData?.service?.qualityAssuranceText?.split(";") || []
              }
            />
          </View>
        </div>
      </div>
      <div className="flex gap-2 mx-6 my-5">
        <Button
          className="w-1/2 gap-2"
          onClick={() => setShowEnquiryModal(true)}
        >
          <DocumentTextIcon className="w-4 h-4" />
          Request a Quotation
        </Button>
        <Button
          className="w-1/2 gap-2"
          onClick={() => setShowScheduleVisitModal(true)}
        >
          <CalendarDaysIcon className="w-4 h-4" />
          Schedule a Visit
        </Button>
      </div>
      <Modal
        title="Select Enquiry Type"
        showModal={showEnquiryModal}
        showBtns={false}
        closeModal={_closeEnquiryTypeModal}
      >
        <ServiceRequestQuotationForm
          {...{
            setData: setRequestQuoteData,
            data: requestQuoteData,
            closeEnquiryModal: _closeEnquiryTypeModal,
            serviceId: props.id,
            groups,
          }}
        />
      </Modal>
      <Modal
        title={`Schedule A Visit for ${serviceData?.service?.name} Service`}
        showModal={showScheduleVisitModal}
        showBtns={false}
        closeModal={_closeScheduleVisitModal}
      >
        <ServiceRequestScheduleVisitForm
          {...{
            setData: setScheduleVisitData,
            data: scheduleVisitData,
            closeScheduleVisitModal: _closeScheduleVisitModal,
            serviceId: props.id,
          }}
        />
      </Modal>
    </div>
  );
}
