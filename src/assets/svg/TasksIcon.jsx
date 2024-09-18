import React from "react";

export default function TasksIcon({
  width = "w-5",
  height = "h-5",
  className = "",
}) {
  return (
    <svg
      className={`${width} ${height} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width={27.832}
      height={31.271}
      data-name="Group 4128"
      fill="currentColor"
    >
      <path
        d="M1289.019 2321.57a2.8 2.8 0 0 0-5.55 0H1272v28.866h27.832v-28.866Zm-8.342 2.256h3.99l.011.006a1.521 1.521 0 0 1-.071-.457 1.807 1.807 0 0 1 3.6 0 1.525 1.525 0 0 1-.07.451h3.017v2.405h-10.478Zm17.354 24.355h-23.248v-24.355h3.6v4.51h15.389v-4.51h4.257Z"
        data-name="Path 85"
        style={{
          mixBlendMode: "normal",
          isolation: "isolate",
        }}
        transform="translate(-1272 -2319.165)"
      />
      <path
        d="M1312.367 2376.248c-2.947-1.965-4.911 0-4.911 0l-7.858 7.531-1.31 6.221 6.221-.982 8.186-7.858c2.292-2.948-.328-4.912-.328-4.912Zm-1.589 4.081-6.157 6-2.937.464.618-2.937 6-5.847a1.792 1.792 0 0 1 2.319 0 1.558 1.558 0 0 1 .157 2.319Z"
        data-name="Path 90"
        style={{
          mixBlendMode: "normal",
          isolation: "isolate",
        }}
        transform="translate(-1291.502 -2363.803)"
      />
    </svg>
  );
}
