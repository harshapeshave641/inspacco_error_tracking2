import React from "react";
import moment from "moment";
import Badge from "../../../components/common/Badge";

export default function FilterPillSection({ data: appliedFilters }) {
  return (
    <div>
      <div className="overflow-x-scroll flex gap-2 ml-2 items-center overflow-y-hidden">
        {Object.keys(appliedFilters).map((key) => {
          if (Array.isArray(appliedFilters[key])) {
            return appliedFilters[key]?.map((formKey) => {
              return (
                <Badge color="accent" className={"badge badge-lg shrink-0"}>
                  {formKey?.label || formKey}
                  {/* <XMarkIcon className="w-4 h-4 cursor-pointer" /> */}
                </Badge>
              );
            });
          } else {
            if (key === "dateRange") {
              return (
                <Badge color="accent" className={"badge badge-lg shrink-0"}>
                  {`${moment(appliedFilters[key].startDate).format(
                    "DD MMM YYYY"
                  )} - ${moment(appliedFilters[key].endDate).format(
                    "DD MMM YYYY"
                  )}`}
                </Badge>
              );
            } else {
              return appliedFilters[key]?.label ? (
                <Badge color="accent" className={"badge badge-lg shrink-0"}>
                  {appliedFilters[key]?.label}
                  {/* <XMarkIcon className="w-4 h-4 cursor-pointer" /> */}
                </Badge>
              ) : null;
            }
          }
        })}
      </div>
    </div>
  );
}
