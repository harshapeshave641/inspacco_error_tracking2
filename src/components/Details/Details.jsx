import React from "react";
import { _getPriorityType, _getStatusType } from "../../helpers/utils";

const Skeleton = () => {
  return (
    <div role="status" class="animate-pulse">
      <div class="h-4 bg-base-300 rounded-full mb-4" />
      <div className="animate-pulse">
        <div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5" />
          <div class="h-2 bg-base-300 rounded-full mb-2.5" />
          <div class="h-2 bg-base-300 rounded-full mb-2.5" />
        </div>
        <div>
          <div class="h-52 mt-8 bg-base-300 rounded mb-2.5" />
        </div>
      </div>
    </div>
  );
};

export default function Details({
  header,
  detailActionsComp,
  details_header,
  details_content,
  actionsComp,
}) {
  return (
    <div className="p-4">
      <div className="">
        <div className="flex justify-between">
          {header && (
            <div className="font-semibold text-lg">
              {header || "Details"}
              {detailActionsComp}
            </div>
          )}
          <div className=" ">{actionsComp ? actionsComp : null} </div>
        </div>
        {header && <div className="divider my-1" />}
        <div className="w-[98%] mx-auto">
          <div>
            <div>
              {details_header}
              <div className="mt-4 rounded">{details_content}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
