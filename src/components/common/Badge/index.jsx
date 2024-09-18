import classNames from "classnames";
import React from "react";

export default function Badge({ children, text = "", color = "", className }) {
  let classes = classNames(
    {
      "badge-info": color === "info" || color.includes("blue"),
      "badge-error": color === "error" || color.includes("red"),
      "badge-success": color === "success" || color.includes("green"),
      "badge-warning": color === "warning" || color.includes("yellow"),
      "badge-accent": color === "accent",
    },
    className
  );

  return (
    <div
      className={`badge ${classes} text-white capitalize text-[10px] w-max font-semibold rounded-full`}
    >
      {children || text}
    </div>
  );
}
