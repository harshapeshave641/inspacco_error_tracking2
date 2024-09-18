import React from "react";
import {
  getFileUrl,
  getHumanReadableDateTime,
  splitProperCase,
} from "../../../helpers/utils";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import EmptyData from "../EmptyData";
import _ from "lodash";

function ActivityHistory({ activities = [] }) {
  console.log("activities", activities);
  if (!activities.length) {
    return <EmptyData msg="No Activity" />;
  }
  return (
    <div className="space-y-4">
      {_.reverse(_.sortBy(activities, "createdAt")).map((activity, index) => (
        <div key={index} className="flex p-4 rounded-lg shadow-md bg-base-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {activity.createdBy.profilePicture ? (
                <img
                  src={getFileUrl(activity.createdBy.profilePicture)}
                  alt={`${activity.createdBy.firstName} ${activity.createdBy.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10" />
              )}
            </div>
            <div className="flex-grow">
              <div className="text-sm font-semibold">
                {activity.createdBy.firstName} {activity.createdBy.lastName}
              </div>
              <div className="text-gray-500">
                {getHumanReadableDateTime(activity.createdAt)}
              </div>
            </div>
          </div>
          <div className="pl-10 mt-2">
            <div className="font-bold text-md">{activity.value}</div>
            <div className="text-gray-600">
              {splitProperCase(activity.action)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityHistory;
