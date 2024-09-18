import React, { useState } from "react";
import classNames from "classnames";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

export default function Dropdown({
  type = "ghost",
  label = "Select",
  options = [],
  showArrow = false,
  prefixIcon = null,
  className = "",
  suffixIcon = null,
  onChange,
}) {
  let [selectedOption, setSelectedOption] = useState(null);

  const btnClasses = classNames({
    "btn-ghost": type === "ghost",
    "btn-primary": type === "primary",
    "btn-secondary": type === "secondary",
  });

  const handleClick = (opt) => {
    const elem = document.activeElement;
    if (elem) elem?.blur();
    onChange(opt);
    setSelectedOption(typeof opt === "object" ? opt.label : opt);
  };

  return (
    <div className={`dropdown ${className}`}>
      <label
        tabIndex={0}
        className={`btn ${btnClasses} justify-between w-full !padding-0 text-gray-500 btn-sm capitalize tracking-[0.3px] gap-1 font-normal flex m-1 min-w-max `}
      >
        {prefixIcon}
        <span className="inline-block text-sm font-semibold">
          {selectedOption || label}
        </span>
        {suffixIcon || (showArrow && <ChevronDownIcon className="w-4 h-4" />)}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content text-accent z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {options?.map((opt, index) => (
          <li onClick={() => handleClick(opt)} key={index}>
            <a>{typeof opt === "object" ? opt.label : opt}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
