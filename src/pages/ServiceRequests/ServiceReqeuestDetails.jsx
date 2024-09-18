import React from "react";
import LabelValue from "../../components/common/LabelValue";
import { getHumanReadableDateTime } from "../../helpers/utils";

export default function ServiceReqeuestDetails({ serviceRequest = {} }) {
  return (
    <div className="flex flex-col">
      <LabelValue
        label={"Visit Date"}
        value={getHumanReadableDateTime(serviceRequest?.visitDate)}
      ></LabelValue>
      {serviceRequest?.subService ? (
        <LabelValue
          label={"Sub Service"}
          value={serviceRequest?.subService}
        ></LabelValue>
      ) : null}
    </div>
  );
}
