import React from "react";

import { ServiceTile } from "../ActiveServices/ActiveServices";
import gardening from "../../../assets/svg/icons/gardening.svg";

const MoreServices = () => {
  return (
    <>
      <div className=" bg-blue-950 py-3 rounded-md px-5 max-w-lg">
        <p className=" text-white capitalize text-base">More Services</p>
      </div>
      <div className="flex">
        <ServiceTile {...{ imgSrc: gardening, label: "Gardening" }} />
      </div>
    </>
  );
};

export default MoreServices;
