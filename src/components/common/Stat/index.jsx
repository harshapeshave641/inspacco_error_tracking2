import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import React from "react";

export default function Stat({
  title,
  icon,
  content,
  desc,
  actions,
  className,
  onClick,
  innerClassName,
}) {
  return (
    <div
      className={`stats shadow flex items-center ${className}`}
      onClick={onClick}
    >
      <div className="pl-3 pr-1">
        {icon || <InformationCircleIcon className="w-6 h-6" />}
      </div>
      <div
        className={`stat border-none text-base-content border-l-none pl-2 ${innerClassName}`}
      >
        <div className="stat-title text-base-content">{title}</div>
        <div className="stat-value text-base-content">{content}</div>
        <div className="stat-desc text-base-content">{desc}</div>
        {actions && (
          <div className="stat-actions text-base-content">{actions}</div>
        )}
      </div>
    </div>
  );
}
