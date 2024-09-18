import React, { useState } from "react";

import EmptyData from "../EmptyData";
import Button from "../neomorphic/Button";

const Skeleton = () => {
  return (
    <div className="animate-pulse bg-base-300 w-42 h-20 flex flex-col justify-center items-center rounded" />
  );
};

const BlocksGrid = ({
  header = null,
  data = [],
  loading = false,
  accessor = null,
  selectedBlock,
  setSelectedBlock,
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
              {data.map((node) => (
                <div
                  onClick={(e) => setSelectedBlock(node)}
                  className={` ${
                    node.id === selectedBlock.id
                      ? "bg-base-300 border-color-white ring-2"
                      : "bg-base-100"
                  } h-20 w-30 text-center text-ellipsis shadow-md hover:bg-base-300 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center rounded-lg`}
                >
                  <p className="text-[13px] overflow-hidden font-medium py-1">
                    {node?.[accessor].name || node.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {node?.[accessor].name}
                  </p>
                </div>
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

export default BlocksGrid;
