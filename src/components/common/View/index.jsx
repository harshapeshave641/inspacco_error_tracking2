import React from "react";

export default function View({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
