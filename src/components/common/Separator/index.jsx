import React from "react";

export default function Separator({ children, className = "" }) {
  return <div className={`${className} divider`}>{children}</div>;
}
