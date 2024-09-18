import { TrashIcon } from "@heroicons/react/24/solid";
import React from "react";
import Select, { components } from "react-select";
// import Placeholder from "react-select/dist/declarations/src/components/Placeholder";

const customStyles = {
  multiValueLabel: {
    maxWidth: "70%", // Adjust the maximum width as per your requirement
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  collapsedLabel: {
    maxWidth: "100%", // Adjust the maximum width as per your requirement
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const MAX_DISPLAY_TAGS = 3; // Set the maximum number of tags to display

const MultiValueLabel = (props, index) => {
  console.log("props", props, index);
  if (props.selectProps.value.length < MAX_DISPLAY_TAGS) {
    return (
      <components.MultiValueLabel
        {...props}
        style={customStyles.multiValueLabel}
      >
        {props.data.label}
      </components.MultiValueLabel>
    );
  } else if (props.selectProps.value.length === MAX_DISPLAY_TAGS) {
    return (
      <components.MultiValueLabel
        {...props}
        style={customStyles.collapsedLabel}
      >
        +{props.selectProps.value.length - MAX_DISPLAY_TAGS} more
      </components.MultiValueLabel>
    );
  }
  return null; // Hide the label for tags beyond the maximum display count
};

export default function Select({
  multiple = false,
  className,
  value = "",
  onChange,
  options = [],
  native = true,
  disabled = false,
  placeholder = "Select",
  menuPlacement = "auto",
  portalStyles = {},
  menuPortalTarget = "",
  isClearable,
  ...rest
}) {
  const customStyles = {
    ...portalStyles,
    multiValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
    }),
    multiValueLabel: (base) => ({
      ...base,
      maxWidth: "80%", // Adjust as needed
    }),
  };

  return !native ? (
    <Select
      isMulti={multiple}
      onChange={onChange}
      isClearable={isClearable}
      className={`${className} my-react-select-container`}
      classNamePrefix="my-react-select"
      components={{
        ClearIndicator: (params) => {
          return (
            <TrashIcon
              onClick={() => params.clearValue()}
              className="cursor-pointer pr-1 w-4 h-4"
            />
          );
        },
      }}
      menuShouldScrollIntoView
      menuPortalTarget={
        menuPortalTarget ? document.body.querySelector(menuPortalTarget) : null
      }
      // defaultMenuIsOpen={true}
      options={options}
      value={
        typeof value === "object"
          ? value
          : options.find((o) => o.value === value)
      }
      disabled={disabled}
      isDisabled={disabled}
      placeholder={placeholder}
      menuPlacement={menuPlacement}
      styles={customStyles}
      {...rest}
    />
  ) : (
    <select
      className={`${className || "w-full"} select select-bordered rounded-md `}
      value={value}
      onChange={(e) => {
        if (multiple) {
          const selectedValues = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          onChange(selectedValues);
        } else {
          onChange(e.target.value);
        }
      }}
      disabled={disabled}
      multiple={multiple}
    >
      {options.map((option, index) => (
        <option
          key={index}
          value={typeof option === "object" ? option.value : option}
          // onClick={() => {
          //   setSelectedOption(option);
          //   onChange(option);
          // }}
          // selected={option === selectedOption}
        >
          {typeof option === "object" ? option.label : option}
        </option>
      ))}
    </select>
  );
}
