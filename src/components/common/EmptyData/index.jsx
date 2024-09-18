import React from "react";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";

export default function EmptyData({
  msg = "No Data",
  icon = null,
  align = "",
}) {
  return (
    <div className={`h-full flex justify-center ${align || "items-center"}`}>
      <div className="inline-flex items-center justify-center gap-3 text-sm font-medium text-accent">
        {icon || <WalletIcon className="w-7 h-7" />}
        {msg}
      </div>
    </div>
  );
}
