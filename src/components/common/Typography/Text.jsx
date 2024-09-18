import React from "react";

export default function Text({ children, className = "" }) {
  return <label className={`${className}`}>{children}</label>;
}
