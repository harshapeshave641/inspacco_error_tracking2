import React from "react";

export default function CalendarIcon({
  width = "w-5",
  height = "h-5",
  className = "",
}) {
  return (
    <svg
      className={`${width} ${height} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
    >
      <g fill="currentColor" data-name="calendar (1)">
        <path
          d="M24.438 2.834h-1.771V1.417a1.417 1.417 0 0 0-2.833 0v1.417H8.5V1.417a1.417 1.417 0 0 0-2.833 0v1.417H3.9A3.9 3.9 0 0 0 0 6.729v15.938a4.255 4.255 0 0 0 4.25 4.25h7.083a1.417 1.417 0 1 0 0-2.833H4.25a1.418 1.418 0 0 1-1.417-1.417V11.334H25.5a1.417 1.417 0 0 0 2.833 0v-4.6a3.9 3.9 0 0 0-3.9-3.9Zm0 0"
          data-name="Path 6609"
        />
        <path
          d="M24.791 15.584a9.208 9.208 0 1 0 9.208 9.208 9.219 9.219 0 0 0-9.208-9.208Zm4.259 7.657-4.6 5.313a1.424 1.424 0 0 1-1.02.489h-.051a1.415 1.415 0 0 1-1-.415L19.9 26.149a1.416 1.416 0 0 1 2-2l1.4 1.4 3.607-4.162a1.417 1.417 0 0 1 2.142 1.854Zm0 0"
          data-name="Path 6610"
        />
      </g>
    </svg>
  );
}
