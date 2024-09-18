import React from "react";

export default function HoverIcon({ onClick, icon, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`${className} inline-flex mx-2 rounded-full transition-all duration-300 hover:bg-accent hover:text-white p-2 cursor-pointer items-center`}
    >
      {icon}
    </div>
  );
}
