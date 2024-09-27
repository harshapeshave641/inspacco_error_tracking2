import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@heroicons/react/24/solid/HomeModernIcon";
import GiftIcon from "@heroicons/react/24/solid/GiftIcon";
import TasksIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon";
import AlertIcon from "@heroicons/react/24/solid/ShieldExclamationIcon";
import ServiceRequestsIcon from "@heroicons/react/24/solid/WrenchScrewdriverIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import ShoppingCartIcon from "@heroicons/react/24/solid/ShoppingCartIcon";
import BellAlertIcon from "@heroicons/react/24/solid/BellAlertIcon";
import KeyIcon from "@heroicons/react/24/solid/KeyIcon";
import ReportsIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon";
import { useSelector } from "react-redux";

export default function AdminSidebar({ onChange }) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { isAuthenticated, roles, activeRole } = useSelector(
    (state) => state.authSlice
  );

  // console.log("activeRole", AdminSidebar);
  const menuItems = [
    {
      label: "Home",
      route: "/",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: "Reports",
      route: "/admin/reports",
      icon: <ReportsIcon className="w-5 h-5" />,
       hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Services",
      route: "/admin/services",
      icon: <TasksIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
   
    {
      label: "Clients",
      route: "/admin/clients",
      icon: <UserGroupIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Partners",
      route: "/admin/partners",
      icon: <UserPlusIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Complaints",
      route: "/admin/complaints",
      icon: <AlertIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Service Requests",
      route: "/admin/service-requests",
      icon: <ServiceRequestsIcon className="w-5 h-5" />,
    },
    {
      label: "Access Management",
      route: "/admin/access-management",
      icon: <KeyIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Redeem Requests",
      route: "/admin/redeem-requests",
      icon: <GiftIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Notifications",
      route: "/admin/notifications",
      icon: <BellAlertIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
    {
      label: "Orders",
      route: "/admin/orders",
      icon: <ShoppingCartIcon className="w-5 h-5" />,
      hide: activeRole == "INSPACCO_KAM" ? true : false,
    },
  ];
 
  // console.log("menuItems", menuItems);
  return (
    
    <div>
      {/* <TestError1/> */}
      <ul className="space-y-2 text-sm tracking-wide">
        {menuItems
          .filter((obj) => !obj.hide)
          .map(({ label, route, icon }, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  setSelectedMenu(route);
                  onChange();
                }}
                className="min-w-max"
              >
                <Link
                  to={route}
                  aria-label={label}
                  className={`relative flex items-center space-x-4 px-4 py-2 rounded-md group hover:bg-black hover:bg-opacity-25 hover:text-[#04B3FF] transition-all duration-300 ${
                    selectedMenu === route
                      ? "text-[#04B3FF] bg-opacity-25 bg-black"
                      : "text-white"
                  }`}
                >
                  {icon}
                  <span className="pl-0.5 text-[12.5px] font-medium">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
