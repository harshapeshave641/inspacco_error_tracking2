import React from "react";

export default function AlertIcon({
  width = "w-5",
  height = "h-5",
  className = "",
}) {
  return (
    <svg
      className={`${width} ${height} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="34.722"
      height="34.722"
      fill="currentColor"
    >
      <circle
        cx="4.34"
        cy="4.34"
        r="4.34"
        data-name="Ellipse 132"
        transform="translate(22.424 16.637)"
      />
      <path
        d="M30.744 27.488h-7.957a3.982 3.982 0 0 0-3.979 3.979v2.17a1.085 1.085 0 0 0 1.085 1.085h13.744a1.085 1.085 0 0 0 1.085-1.085v-2.17a3.982 3.982 0 0 0-3.978-3.979Z"
        data-name="Path 6606"
      />
      <ellipse
        cx="1.825"
        cy="2.737"
        data-name="Ellipse 133"
        rx="1.825"
        ry="2.737"
        transform="translate(3.784 21.798)"
      />
      <path
        d="M7.6 28.935H3.979A3.982 3.982 0 0 0 0 32.914v.721a1.085 1.085 0 0 0 1.085 1.085h9.4a1.085 1.085 0 0 0 1.089-1.085v-.723A3.982 3.982 0 0 0 7.6 28.935Z"
        data-name="Path 6607"
      />
      <path
        d="M17.723 0H3.979A3.982 3.982 0 0 0 0 3.979v10.85a3.982 3.982 0 0 0 3.979 3.979h7.171l4.389 4.052a1.085 1.085 0 0 0 1.821-.8v-3.252h.362a3.982 3.982 0 0 0 3.978-3.979V3.979A3.982 3.982 0 0 0 17.723 0Zm-6.872 15.191a1.085 1.085 0 1 1 1.085-1.085 1.085 1.085 0 0 1-1.085 1.085Zm1.085-4.7a1.085 1.085 0 1 1-2.17 0V5.425a1.085 1.085 0 0 1 2.17 0Z"
        data-name="Path 6608"
      />
    </svg>
  );
}
