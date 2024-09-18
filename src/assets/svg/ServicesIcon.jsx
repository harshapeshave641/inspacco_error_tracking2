import React from "react";

export default function ServicesIcon({
  width = "w-5",
  height = "h-5",
  className = "",
}) {
  return (
    <svg
      className={`${width} ${height} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width={32.882}
      height={24.323}
    >
      <g fill="currentColor" data-name="Group 4131">
        <path
          d="M838.168 2391.171s-4.6.708-6.364-1.06a8.228 8.228 0 0 0-8.839-1.768c-3.889 1.415-5.657 2.122-5.657 2.122l2.829 7.071s4.6-2.829 6.364-2.122 7.779 4.6 8.839 4.6 14.85-6.365 14.85-6.365l-1.768-2.475-12.552 5.481s-.707.708-2.475-.354-5.657-3.182-5.657-3.182-2.122-1.415-6.011.707l-.707-1.414 3.182-1.415s3.889-1.061 6.01.707a7.827 7.827 0 0 0 4.95 2.122h3.182Z"
          data-name="Path 83"
          style={{
            mixBlendMode: "normal",
            isolation: "isolate",
          }}
          transform="translate(-817.307 -2375.688)"
        />
        <path
          d="m893.727 2318.578 2.1 4.249 4.689.681-3.393 3.307.8 4.669-4.194-2.2-4.194 2.2.8-4.669-3.393-3.307 4.689-.681Z"
          data-name="Path 84"
          style={{
            mixBlendMode: "normal",
            isolation: "isolate",
          }}
          transform="translate(-872.642 -2318.577)"
        />
      </g>
    </svg>
  );
}
