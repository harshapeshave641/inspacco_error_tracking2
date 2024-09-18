import React from "react";

export default function BuildingIcon({
  width = "w-5",
  height = "h-5",
  className = "",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${width} ${height} ${className}`}
      width="28.233"
      height="31.37"
    >
      <g data-name="Group 4104">
        <path
          fill="currentColor"
          d="M25.096 28.233V0H3.137v28.233H0v3.137h28.233v-3.137ZM12.548 3.137h3.137v3.137h-3.137Zm0 6.274h3.137v3.137h-3.137Zm0 6.274h3.137v3.137h-3.137Zm-3.137 3.137H6.274v-3.137h3.137Zm0-6.274H6.274V9.411h3.137Zm0-6.274H6.274V3.137h3.137Zm7.843 21.959H10.98V25.1a3.137 3.137 0 1 1 6.274 0Zm4.706-9.411h-3.138v-3.137h3.137Zm0-6.274h-3.138V9.411h3.137Zm0-6.274h-3.138V3.137h3.137Z"
          data-name="Path 6603"
        />
      </g>
    </svg>
  );
}
