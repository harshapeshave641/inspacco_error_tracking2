import React, { useEffect, useRef } from "react";
import classNames from "classnames";

export default function Toggle({
  className = "",
  label,
  checked,
  onChange,
  size = "sm",
  indeterminate = false,
}) {
  const radioRef = useRef(null);
  let sizeClasses = classNames({
    "toggle-xs": size === "xs",
    "toggle-sm": size === "sm",
    "toggle-md": size === "md",
    "toggle-lg": size === "lg",
  });

  useEffect(() => {
    radioRef.current.indeterminate = indeterminate;
  }, []);

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        {label && <span className="label-text mr-2">{label}</span>}
        <input
          type="checkbox"
          ref={radioRef}
          className={`toggle ${className} ${sizeClasses}`}
          onChange={() => onChange(!checked)}
          checked={checked}
        />
      </label>
    </div>
  );
}
