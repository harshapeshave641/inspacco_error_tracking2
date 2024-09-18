import React from "react";

export default function Card({ className = "p-4", children }) {
  return <div className={`card rounded-lg ${className}`}>{children}</div>;
}
