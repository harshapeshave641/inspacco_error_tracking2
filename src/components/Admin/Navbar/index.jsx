import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import InspaccoLogo from "./../../../assets/images/InspaccoWhiteLogo.png";
import LogoutIcon from "@heroicons/react/24/solid/PowerIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";

import { logout } from "../../../slice/authSlice";

import Button from "../../common/neomorphic/Button";
import ThemeToggle from "../../common/ThemeToggle";
import Badge from "../../common/Badge";
import { ROLES } from "../../../constants";

export default function AdminNavbar({ children, toggleDrawer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, activeRole } = useSelector((state) => state.authSlice);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <div className="navbar relative z-[999] transition-all duration-300 bg-primary dark:bg-base-100 text-base-100 drop-shadow-lg">
        <div className="navbar-start w-50 ">
          <div className="navbar-left px-4 text-white inline-block items-center flex">
            <img className="w-40" src={InspaccoLogo} alt="logo" />{" "}
            <Badge
              text="Admin"
              color="info"
              className={"font-semibold text-base rounded-md p-3"}
            />
          </div>
          <button
            className="btn btn-ghost mx-2 dark:text-gray-400 btn-circle"
            onClick={toggleDrawer}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <div className="navbar-end w-1/2">
          <ThemeToggle />
          <label className="btn btn-ghost text-white text-md ml-3 mr-1">
            Hi, {user?.firstName}
          </label>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="user-profile-icon btn btn-ghost btn-circle">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </label>
            <div
              style={{
                position: "fixed",
                right: 5,
                top: 60,
                zIndex: 9999,
              }}
              className="menu dropdown-content shadow bg-base-100 overflow-hidden rounded-box w-80 mt-4"
            >
              <div className="flex justify-between items-center bg-primary p-2">
                <Button
                  onClick={logoutHandler}
                  type="ghost"
                  className="gap-2 text-white hover:dark:text-accent"
                >
                  <LogoutIcon className="w-5 h-5" />
                  Logout
                </Button>
              </div>
              <div className="flex justify-center items-center gap-4 p-4">
                <div className="avatar online placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                    <span className="text-xl">{`${user?.firstName.charAt(
                      0
                    )}${user?.lastName.charAt(0)}`}</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-accent">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs font-semibold text-accent">
                  {activeRole == ROLES.INSPACCO_KAM ?'Client Super Admin': activeRole?.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
              <div className="p-2 ml-2 grid grid-cols-2 justify-items-start">
                <div className="dark:text-white text-xs text-primary text-sm">
                  <a
                    className="mb-1 gap-2 flex items-start"
                    href={`tel:${user?.mobileNumber}`}
                  >
                    <PhoneIcon className="h-4 w-4" />
                    <div>
                      <span className="font-semibold">Phone: </span>
                      <p className="mobile-number-text">{user?.mobileNumber || "-"}</p>
                    </div>
                  </a>
                </div>
                <div className="dark:text-white text-primary text-sm">
                  <a
                    className="mb-1 text-xs gap-2 text-overflow ellipsis flex items-start"
                    href={`to:${user?.email}`}
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <div>
                      <span className="font-semibold">Email: </span>
                      <p>{user?.email || "-"}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
