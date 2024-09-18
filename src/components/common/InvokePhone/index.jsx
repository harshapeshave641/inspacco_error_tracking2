import PhoneArrowUpRightIcon from "@heroicons/react/24/solid/PhoneArrowUpRightIcon";
import React from "react";

export default function InvokePhone({ phone }) {
  return (
    <div className="inline-flex rounded-full transition-all duration-300 hover:bg-accent hover:text-white p-2 cursor-pointer items-center">
      <a
        title={phone}
        className="inline-flex items-center gap-2 pr-1"
        href={`tel:+${phone}`}
      >
        <PhoneArrowUpRightIcon className="w-4 h-4 inline-block" />{" "}
        <span className="text-sm ml-1">Call</span>
      </a>
    </div>
  );
}
