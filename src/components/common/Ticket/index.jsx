import React from "react";
import { _getPriorityType, _getStatusType } from "../../../helpers/utils";
import Badge from "../Badge";

import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

export default function Ticket({
  className = "",
  icon,
  active,
  data,
  onClick,
  btnText,
  ...rest
}) {
  let {
    name,
    location,
    requester,
    helperText,
    helperSubText,
    date,
    status,
    priority,
    node,
    assignedTo,
    category,
  } = data;

  return (
    <>
      <div
        onClick={(e) => onClick(node)}
        {...rest}
        className={` cursor-pointer alert gap-[1px] shadow rounded-md group/item items-start flex-col ${className} ${
          active ? "bg-base-300 ring" : "bg-base-200"
        } hover:bg-base-300 hover:ring duration-300 justify-start transition-all`}
      >
        <div className="w-full">
          {/* {icon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          )} */}
          <div className="w-full ml-1">
            <div className="flex gap-2 justify-between">
              <div className="flex text-left w-full">
                <div className="w-full">
                  <h3 className="overflow-hidden text-ellipsis font-bold text-sm w-full">
                    {name}
                  </h3>
                  <p className="text-xs mr-1">
                    {location
                      ? location
                      : assignedTo?.firstName
                      ? `${assignedTo?.firstName} ${assignedTo?.lastName}`
                      : requester?.firstName
                      ? `${requester?.firstName} ${requester?.lastName}`
                      : ""}
                  </p>
                </div>
                <div className="w-full " style={{ textAlign: "right" }}>
                  <p className="text-xs font-semibold">{helperText}</p>
                  <p className="mb-1 text-xs">{helperSubText}</p>
                </div>
              </div>
            </div>
            <div className="w-full pt-1 flex justify-between">
              <div className="text-xs">
                <div className="inline-flex gap-1">
                  {status && (
                    <Badge
                      text={status
                        ?.split("_")
                        ?.join(" ")
                        ?.replace("SENT", "RECEIVED")}
                      color={_getStatusType(status)}
                    />
                  )}
                  {priority && (
                    <Badge text={priority} color={_getPriorityType(priority)} />
                  )}
                  {category && (
                    <Badge text={category} color={_getPriorityType(category)} />
                  )}
                </div>
              </div>
              {date ? (
                <div className="inline-flex gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <p className="font-semibold text-xs">{date}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* <div
          onClick={() => {
            onClick(node);
          }}
          className="absolute cursor-pointer transition-all duration-300 right-6 group/edit invisible rounded-full px-2 py-1.5 bg-base-200 hover:bg-base-100 group-hover/item:visible"
        >
          <span className="font-semibold text-xs">{btnText || "Details"}</span>
          <ChevronRightIcon className="w-4 h-4 group-hover/edit:translate-x-0.5" />
        </div> */}
      </div>
    </>
  );
}
