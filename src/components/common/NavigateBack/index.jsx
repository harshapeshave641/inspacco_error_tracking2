import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Button from "../neomorphic/Button";

export default function NavigateBack({
  onClick = () => {},
  className = "",
  to = null,
}) {
  const navigate = useNavigate();

  return (
    <Button
      type="ghost"
      className={`btn-sm ${className}`}
      onClick={() => {
        navigate(to || -1);
        onClick();
      }}
    >
      <ArrowLeftIcon className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  );
}
