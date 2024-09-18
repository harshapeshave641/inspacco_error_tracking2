import React, { useState } from "react";

export default function Tabs({
  tabsList = [],
  className = "",
  defaultActiveTab = null,
  onChange,
}) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <>
      <div
        className={`${className} tabs tabs-boxed bg-base-100 self-center transition-all duration-300`}
      >
        {tabsList.map((tab, index) => {
          return (
            <a
              key={index}
              className={
                "tab " +
                (activeTab === tab.name
                  ? "tab-active dark:!text-accent !text-white"
                  : "")
              }
              onClick={(e) => {
                if (typeof onChange === "function") onChange(tab.name);
                setActiveTab(tab.name);
              }}
            >
              <div className="flex items-center justify-center gap-1">
                {tab.icon}
                {tab.label}
                {tab.extra && tab.extra(cart)}
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
