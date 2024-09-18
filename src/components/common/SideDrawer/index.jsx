import React from "react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import classNames from "classnames";

export default function SideDrawer({
  header = "",
  isOpen = false,
  setIsOpen = () => {},
  className = "",
  children,
  placement = "right",
  width = "w-80",
  height = "h-full",
}) {
  const close = () => setIsOpen(false);

  const translateClasses = classNames({
    "-translate-x-full": placement === "left",
    "translate-x-full": placement === "right",
    "-translate-y-full": placement === "top",
    "translate-y-full": placement === "bottom",
  });

  const placementClasses = classNames({
    "left-0": placement === "left",
    "right-100": placement === "right",
    "top-0": placement === "top",
    "bottom-0": placement === "bottom",
  });

  return (
    <div
      className={`fixed overflow-hidden z-20 backdrop-blur-sm inset-0 transform ease-in-out ${
        isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : `transition-all delay-500 opacity-0 ${translateClasses}`
      }`}
    >
      <section
        className={`${width} ${height} ${className} ${placementClasses} absolute bg-primary dark:bg-base-100 shadow-xl duration-500 ease-in-out transition-all transform  
            ${isOpen ? "translate-x-0" : `${translateClasses}`}`}
      >
        <div className="relative pb-5 flex flex-col h-full">
          <div className="navbar flex pl-4 pr-4 shadow-md">
            <button
              className="float-left btn btn-circle btn-outline btn-sm"
              onClick={() => close()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold text-xl">{header}</span>
          </div>

          <div className={`pl-4 pr-4 overflow-y-auto mt-2`}>{children}</div>
        </div>
      </section>
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => close()}
      />
    </div>
  );
}
