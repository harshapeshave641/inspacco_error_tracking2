import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeIcon from "@heroicons/react/24/solid/HomeModernIcon";
import ReportsIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon";
import CalendarIcon from "@heroicons/react/24/solid/CalendarDaysIcon";
import TasksIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon";
import AlertIcon from "@heroicons/react/24/solid/ShieldExclamationIcon";
import ServicesIcon from "@heroicons/react/24/solid/WrenchScrewdriverIcon";
import ServiceRequestsIcon from "@heroicons/react/24/solid/WrenchScrewdriverIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import ShoppingCartIcon from "@heroicons/react/24/solid/ShoppingCartIcon";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";


import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";



export default function Sidebar() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  let { activeRole } = useSelector((state) => state.authSlice);
  const { t } = useTranslation();
  const menuItems = [
    // {
    //   label: t('menu.home'),
    //   route: "/",
    //   icon: <HomeIcon className="w-5 h-5" />,
    //   disabled: activeRole == "SOCIETY_STAFF",
    // },
    {
      label: t('menu.dashboard'),
      route: "/dashboard",
      icon: <ChartBarIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label:  t('menu.reports'),
      route: "/reports",
      icon: <ReportsIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label: t('menu.serviceRequest'),
      route: "/service-requests",
      icon: <ServiceRequestsIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label: t('menu.tasks'),
      route: "/tasks",
      icon: <TasksIcon className="w-5 h-5" />,
    },
    {
      label: t('menu.attendance'),
      route: "/attendance",
      icon: <CalendarIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label: t('menu.complaints'),
      route: "/complaints",

      icon: <AlertIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label: "Active Services ",
      route: "/services",
      icon: <ServicesIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label:  t('menu.vendors'),
      route: "/vendors",
      icon: <UserGroupIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
    {
      label: t('menu.catalog'),
      route: "/catalog",
      icon: <ShoppingCartIcon className="w-5 h-5" />,
      disabled:
        window.location.hostname === "portal.inspacco.com" ? true : false,
    },
    {
      label: t('menu.employees'),
      route: "/employee-management",
      icon: <UserPlusIcon className="w-5 h-5" />,
      disabled: activeRole == "SOCIETY_STAFF",
    },
  ];
  return (
    <div>
      <div
        onMouseOver={() => setSidebarExpanded(true)}
        onMouseOut={() => setSidebarExpanded(false)}
        className={`${
          sidebarExpanded ? "w-52" : "w-[3.35rem]"
        } h-content transition-all duration-400 ease-in-out bg-primary dark:bg-base-100 overflow-hidden border-r border-neutral`}
      >
        <div className="flex flex-col justify-between h-[100%] py-3">
          <div>
            <ul className="space-y-2 tracking-wide text-sm">
              {menuItems
                ?.filter((a) => !a.disabled)
                .map(({ label, route, icon }, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => setSelectedMenu(route)}
                      className="min-w-max"
                    >
                      <Link
                        to={route}
                        aria-label={label}
                        className={`relative flex items-center space-x-4 px-4 py-2 group hover:text-[#04B3FF] transition-all hover:bg-gradient-to-l from-primary dark:from-base-100 to-secondary dark:to-base-200 ${
                          selectedMenu === route
                            ? "bg-gradient-to-l text-[#04B3FF]"
                            : "text-white"
                        }`}
                      >
                        {icon}
                        {/* <img className="w-5 h-5" src={icon} alt="menu-icon" /> */}
                        <span className="pl-0.5 text-[12.5px] font-medium">
                          {label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          {/* <div className="min-w-max w-full -mb-3">
            <a
              href="#"
              className="transition-all text-white hover:text-[#04B3FF] hover:bg-gradient-to-r from-primary to-secondary flex items-center space-x-4 px-4 py-3 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Settings</span>
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
