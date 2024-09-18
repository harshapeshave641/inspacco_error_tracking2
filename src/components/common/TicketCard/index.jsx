import React from "react";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

import Badge from "../Badge";
import { _getStatusType } from "../../../helpers/utils";

const TicketCard = ({ icon, activeCard, data, ...rest }) => {
  let {
    name,
    location,
    helperText,
    helperSubText,
    date,
    id,
    status,
    priority,
  } = data;

  return (
    <div className="card" {...rest}>
      <div className="card-body p-0 rounded">
        <div
          className={`flex hover:bg-[#D2D6E4] ${
            activeCard ? "bg-[#D2D6E4]" : "bg-base-100"
          }  duration-300 rounded h-auto`}
        >
          <div className="text-white items-center justify-center rounded bg-[#0DA5FF] flex w-10 h-auto">
            <img src={icon} className="w-5 h-5" />
          </div>
          <div className="p-3 w-full h-auto">
            <div className="flex flex-row justify-between text-[#03386A] items-end">
              <div>
                <div className="flex lg:flex-row items-center flex-wrap mb-1">
                  <h1 className="mr-2 font-bold">{name}</h1>
                  {status && (
                    <Badge text={status} color={_getStatusType(status)} />
                  )}
                  {priority && <Badge text={priority} color="warning" />}
                </div>
                <p className="text-sm mr-1">{location}</p>
                <p className="text-sm font-semibold">{helperText}</p>
                <p className="mb-1 text-sm">{helperSubText}</p>
              </div>
              <div className="flex flex-row items-center">
                <CalendarDaysIcon className="h-4 w-4" />
                <p className="font-semibold text-sm px-2">{date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
