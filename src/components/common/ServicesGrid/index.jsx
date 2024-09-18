import React, { useState } from "react";

import EmptyData from "../EmptyData";
import Button from "../neomorphic/Button";

export const ServiceTile = ({ imgSrc, label, className = "", ...rest }) => {
  const defaultImageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU-yHDbVKeKgeTfo0cPkeSRTSdrl0MvxoSQLabli8mPE6Rni65SXK85QLcruaNz69UTgk&usqp=CAU";
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };
  return (
    <div
      {...rest}
      className={`${className} text-ellipsis h-20 w-20 overflow-hidden text-center shadow-md hover:bg-base-300 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center rounded`}
    >
      {!imageError ? (
        <img
          src={imgSrc}
          alt={label}
          className="max-h-10"
          onError={handleImageError}
        />
      ) : (
        <img src={defaultImageUrl} alt={label} className="max-h-10" />
      )}
      <p className="text-[10px] font-medium py-1">{label}</p>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="animate-pulse bg-base-300 w-42 h-20 flex flex-col justify-center items-center rounded" />
  );
};

const ServicesGrid = ({
  header = null,
  data = [],
  loading = false,
  selectedService,
  setSelectedService,
  showShowMoreBtn = false,
}) => {
  let [showMore, setShowMore] = useState(false);

  return (
    <div>
      <div className="bg-primary dark:bg-base-100 py-3 shadow-md rounded-md px-5 max-w-lg">
        <p className="capitalize text-white font-medium dark:text-accent">
          {header || "Active Services"}
        </p>
      </div>
      {!data.length && loading ? (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 my-4">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : data.length ? (
        <>
          <div
            className={`${
              !showMore ? "h-full" : "h-full"
            } transition-all duration-300 overflow-hidden`}
          >
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 my-3 mx-1">
              {data.map(({ node }) => (
                <div
                  onClick={(e) => setSelectedService(node)}
                  className={` ${
                    node.id === selectedService.id
                      ? "bg-base-300 border-color-white ring-2"
                      : "bg-base-100"
                  }  text-ellipsis h-20 w-30 overflow-hidden text-center shadow-md hover:bg-base-300 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center rounded-lg`}
                >
                  <p className="text-[13px] font-medium py-1">
                    {node?.service?.name || node.name}
                  </p>
                  <p className="text-sm text-gray-500">{node?.partner?.name}</p>
                </div>
                // <ServiceTile
                //   {...{
                //     className:
                //       node.id === selectedService.id
                //         ? "bg-base-300 ring-1"
                //         : "bg-base-100",
                //     onClick: () => setSelectedService(node),
                //     imgSrc: _getServiceImage(node?.service?.name || node.name),
                //     label: node?.service?.name || node.name,
                //   }}
                // />
              ))}
            </div>
          </div>
          {showShowMoreBtn && (
            <Button
              onClick={() => setShowMore(!showMore)}
              type="ghost"
              className="w-full"
            >
              {!showMore ? "Show More" : "Show Less"}
            </Button>
          )}
        </>
      ) : (
        <div className="h-20">
          <EmptyData />
        </div>
      )}
    </div>
  );
};

export default ServicesGrid;
