import React from "react";
import classNames from "classnames";
import Loader from "../Loader";

export default function Button({
  type = "primary",
  className = "",
  paddingClass = "px-4",
  onClick,
  children,
  loading = false,
  disabled,
}) {
  let themeClasses = classNames({
    "btn-ghost": type === "ghost",
    "btn-primary": type === "primary",
    "btn-secondary": type === "secondary",
    "btn-outline": type === "outline",
    "btn-accent text-white": type === "accent",
    "btn-success": type === "success",
    "btn-info": type === "info",
    "btn-warning": type === "warning",
    "btn-error": type === "error",
  });

  return (
    <button
      disabled={loading || disabled}
      onClick={onClick}
      loading={loading}
      className={`btn ${themeClasses} ${paddingClass} transition-all uppercase ${className}`}
    >
      {loading && <Loader />}
      {children}
      
    </button>
  );
}
