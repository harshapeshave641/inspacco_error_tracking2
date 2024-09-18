import React from "react";
import { _getServiceThumbnail } from "../../helpers/utils";

export default function ServiceHeroImage({ serviceName = "" }) {
  if (!serviceName) return null;

  return (
    <div>
      <img
        className="rounded-2xl"
        src={_getServiceThumbnail(serviceName.toUpperCase())}
      />
    </div>
  );
}
