import React, { useState } from "react";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import ViewColumnsIcon from "@heroicons/react/24/outline/ViewColumnsIcon";

export default function IconToggle({
  onChange,
  value,
  toggleIcon1 = <Squares2X2Icon className="w-4 h-4" />,
  toggleIcon2 = <ViewColumnsIcon className="w-4 h-4" />,
}) {
  console.log("value", value);

  return (
    <div className="bg-base-100 flex gap-1 p-1 rounded-lg">
      <a
        name={0}
        className={`tab py-1 px-2 rounded-lg ${
          value == 0
            ? "tab-active dark:bg-base-200 bg-accent dark:!text-accent !text-white"
            : ""
        }`}
        onClick={() => onChange(0)}
      >
        <div className="flex items-center justify-center gap-1">
          {toggleIcon1}
        </div>
      </a>
      <a
        name={1}
        className={`tab py-1 px-2 rounded-lg ${
          value == 1
            ? "tab-active dark:bg-base-200 bg-accent dark:!text-accent !text-white"
            : ""
        }`}
        onClick={() => onChange(1)}
      >
        <div className="flex items-center justify-center gap-1">
          {toggleIcon2}
        </div>
      </a>
    </div>
  );
}
