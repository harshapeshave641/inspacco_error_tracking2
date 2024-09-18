import { useEffect, useState } from "react";

import Select from "react-select";
import { defaultTheme } from "react-select";
import Button from "../neomorphic/Button";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
// import { StateOption, stateOptions } from "../data";

const { colors } = defaultTheme;

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
  }),
  menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" }),
};

export default ({ options, onChange, value, menuPlacement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      target={
        <Button
          className="btn-xs !px-1"
          type="ghost"
          onClick={() => setIsOpen((prev) => !prev)}
          // isSelected={isOpen}
        >
          <div className="flex items-center justify-between w-32">
            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
              {value?.label ? `${value.label}` : value || "Select"}
            </div>
            <PencilSquareIcon className="w-4 h-4" />
          </div>
        </Button>
      }
    >
      <Select
        autoFocus
        backspaceRemovesValue={false}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        controlShouldRenderValue={true}
        hideSelectedOptions={false}
        className="my-react-select-container sm"
        classNamePrefix="my-react-select"
        isClearable={false}
        menuIsOpen
        menuPlacement={menuPlacement}
        onChange={(newValue) => {
          // setValue(newValue);
          setIsOpen(false);
          onChange(newValue);
        }}
        options={options}
        placeholder="Search..."
        styles={selectStyles}
        tabSelectsValue={false}
        value={value}
      />
    </Dropdown>
  );
};

// styled components

const Menu = (props) => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      style={{
        // backgroundColor: "white",
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: "absolute",
        zIndex: 2,
      }}
      {...props}
    />
  );
};

const Blanket = (props) => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: "fixed",
      zIndex: 1,
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div style={{ position: "relative" }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);

const Svg = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    focusable="false"
    role="presentation"
    {...p}
  />
);
const DropdownIndicator = () => (
  <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
