import React, { useState } from "react";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import FaceSmileIcon from "@heroicons/react/24/outline/FaceSmileIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";

import InvokePhone from "../../common/InvokePhone";
import env from "../../../env";
import Toggle from "../../common/Toggle";
import moment from "moment";
import SunriseIcon from "../../../assets/svg/SunriseIcon";

const UserIcon = ({ url }) => {
  let { serverURL, appId } = env;
  return url ? (
    <img
      src={`${serverURL}/files/${appId}/${url}`}
      className="w-12 h-12 rounded-lg ring ring-offset-base-100 ring-offset-2"
    />
  ) : (
    <UserCircleIcon className="rounded-lg w-12 h-12" />
  );
};
export default function StaffAttendance({
  image,
  firstName,
  lastName,
  desc,
  mobileNumber,
  markAttendance: handleMarkAttendance,
  attendance,
}) {
  let [checkedIn, setCheckedIn] = useState(!!attendance.inTime);
  let [checkedOut, setCheckedOut] = useState(!!attendance.outTime);

  return (
    <div className="flex shadow w-full text-highlight cursor-pointer bg-base-200 duration-300 transition-all justify-between items-center p-4 my-1 rounded-lg">
      <div className="inline-flex gap-2 text-sm items-center">
        <div className="ml-2 mr-3">
          <UserIcon url={image} />
        </div>
        <div className="">
          <div className="font-medium">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-highlight">{desc}</div>
          <div className="inline-flex w-40 items-center justify-between">
            <Toggle
              {...{
                className: "toggle-success",
                label: "In",
                checked: checkedIn,
                onChange: (state) => {
                  setCheckedIn(state);
                  handleMarkAttendance("checkin", !state, attendance);
                },
              }}
            />
            <Toggle
              {...{
                className: "toggle-success",
                label: "Out",
                checked: checkedOut,
                onChange: (state) => {
                  setCheckedOut(state);
                  handleMarkAttendance("checkout", !state, attendance);
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {mobileNumber && mobileNumber !== "NA" && (
          <InvokePhone phone={mobileNumber} />
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div
              className={`inline-flex gap-1 ${
                attendance.shift ? "visible" : "invisible"
              }`}
            >
              {attendance.shift?.toLowerCase() === "night" && (
                <MoonIcon className="w-4 h-4" />
              )}
              {attendance.shift?.toLowerCase() === "day" && (
                <SunIcon className="w-4 h-4" />
              )}
              {attendance.shift?.toLowerCase() === "morning" && (
                <SunriseIcon className="w-4 h-4" />
              )}
              <span className="text-xs capitalize">
                {attendance.shift?.toLowerCase()}
              </span>
            </div>
            <div
              className={`inline-flex gap-1 ${
                attendance.mode ? "visible" : "invisible"
              }`}
            >
              {attendance.mode === "facial" ? (
                <FaceSmileIcon className="w-4 h-4" />
              ) : (
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
              )}
              <span className="text-xs capitalize">{attendance.mode}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="inline-flex">
              {attendance.inTime && moment(attendance.inTime).isValid() && (
                <div className="inline-flex gap-1">
                  <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                  <span className="text-xs">
                    {moment(attendance.inTime).format("hh:mm:ss A")}
                  </span>
                </div>
              )}
            </div>
            <div className="inline-flex">
              {attendance.outTime && moment(attendance.outTime).isValid() && (
                <div className="inline-flex gap-1 ">
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="text-xs">
                    {moment(attendance.outTime).format("hh:mm:ss A")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
