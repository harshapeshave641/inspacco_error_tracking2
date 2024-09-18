import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import React from "react";

import { Dropdown } from "react-daisyui";
export default function CustomDropdown({
  className = "",
  label = "Actions",
  items = [],
}) {
  const style = {
    color: "#c0c0c0",
    pointerEvents: "none",
    cursor: "not-allowed",
  };
  return (
    <div className={"inline " + className}>
      <Dropdown horizontal="left">
        <Dropdown.Toggle size="sm" color="ghost">
          <div className="inline-flex gap-1">
            <EllipsisVerticalIcon className="w-4 h-4" />
            {label}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-60 border-2 border-base-200">
          {items?.map(({ action, label, icon, disabled }) => (
            <Dropdown.Item
              className={`text-sm hover:text-accent`}
              onClick={action}
            >
              {icon && <span className="icon">{icon}</span>} {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
