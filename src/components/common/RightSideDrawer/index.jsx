import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useMutation, useQuery } from "@apollo/client";

import {
  closeRightDrawer,
  setNotifRefetchFlag,
} from "../../../slice/rightDrawerSlice";

import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { GET_NOTIFICATIONS_FOR_USER } from "../../../graphql/queries/getNotificationsForUser";
import moment from "moment";
import { UPDATE_NOTIFICATION } from "../../../graphql/mutations/notification/updateNotification";

function RightSideDrawer() {
  const [stackMode, setStackMode] = useState(0);
  const { isOpen, header = "Notifications" } = useSelector(
    (state) => state.rightDrawer
  );
  const dispatch = useDispatch();

  const close = (e) => dispatch(closeRightDrawer(e));

  const { user, activeAccountId } = useSelector((state) => state.authSlice);

  const {
    refetch: refetchNotifs,
    data,
    loading,
    fetchMore,
    networkStatus,
  } = useQuery(GET_NOTIFICATIONS_FOR_USER, {
    fetchPolicy: "network-only",
    variables: {
      userId: user?.objectId,
      first: 100,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleCollapse = ({ isRead }) => {
    if (!isRead) {
      dispatch(setNotifRefetchFlag(true));
      refetchNotifs();
    }
    if (!stackMode) setStackMode(1);
  };

  return (
    <div
      className={`fixed overflow-hidden z-20 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ${
        isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : "transition-all delay-500 opacity-0 translate-x-full"
      }`}
    >
      <section
        className={`w-96 right-0 absolute bg-base-100 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative pb-5 flex flex-col h-full">
          <div className="navbar flex pl-4 pr-4 shadow-md">
            <button
              className="float-left btn btn-circle btn-outline btn-sm"
              onClick={() => close()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold text-xl">{header}</span>
          </div>

          <div className={`pl-4 pr-4 ${stackMode ? "overflow-y-auto" : ""}`}>
            <div className="flex flex-col w-full">
              {isEmpty(data) || isEmpty(data?.notifications) ? (
                <div className="mt-3 text-center">No New Notifications!</div>
              ) : (
                <div
                  className={`transition-all duration-500 ${
                    !stackMode ? "stack" : ""
                  }`}
                >
                  {data?.notifications?.edges?.map(({ node }) => (
                    <DrawerNotification
                      {...{ node, handleCollapse, stackMode }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => close()}
      />
    </div>
  );
}

export default RightSideDrawer;

function DrawerNotification({ node, handleCollapse, stackMode }) {
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

  async function markAsRead(notificationId) {
    await updateNotification({
      variables: {
        notificationId,
        isRead: true,
      },
    });
  }

  return (
    <div
      className={`alert p-3 shadow-md border border-gray-200 dark:border-gray-600 cursor-pointer duration-500 transition-all ${
        stackMode ? "mt-2" : "mt-1.5"
      }`}
      onClick={() => {
        if (!node.isRead) markAsRead(node.objectId);
        handleCollapse({ isRead: node.isRead });
      }}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className={`${node.isRead ? "opacity-40" : ""}`}>
          <h3 className="font-bold text-sm">{node.title}</h3>
          <h3 className="font-semibold text-xs">{node.message}</h3>
          <div className="text-[10px]">{moment(node?.createdAt).fromNow()}</div>
        </div>
      </div>
    </div>
  );
}
