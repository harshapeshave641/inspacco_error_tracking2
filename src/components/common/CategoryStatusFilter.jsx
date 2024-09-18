import React, { useEffect, useState, useTransition } from "react";
import Select from "../../components/common/neomorphic/Select";
import { useSelector } from "react-redux";
import { getStatusOptions } from "../../constants";
import { _isEmpty, getActiveServicesOptions } from "../../helpers/utils";
import { useTranslation } from "react-i18next";

function StatusCategoryServiceFilter({
  onFilterChange,
  filters,
  categories = [],
  source,
}) {
  let { activeAccountId, activeServices = [] } = useSelector(
    (state) => state.authSlice
  );
  const { t } = useTranslation();
  const services = getActiveServicesOptions(activeServices) || [];
  console.log("services", services);
  const [filter, setFilter] = useState({
    category: "all",
    service: "all",
    status: "ALL",
  });

  const defaultFilters = filters || ["status", "service", "category"];

  const filtersArr = [
    {
      label: "status",
      options: [{ label: "All", value: "ALL" }, ...getStatusOptions(source)],
    },
    {
      label: "service",
      options: [{ label: "All", value: "all" }, ...services],
    },
    {
      label: "category",
      options: [{ label: "All", value: "all" }, ...categories],
    },
  ];

  console.log("filters", defaultFilters);

  const finalFilters = filtersArr.filter(({ label }) =>
    defaultFilters.includes(label)
  );

  useEffect(() => {
    setFilter({});
  }, [activeAccountId]);

  useEffect(() => {
    onFilterChange(filter);
  }, [filter]);

  function handleFilterChange(field) {
    return (v) => {
      setFilter({ ...filter, [field]: v });
    };
  }

  if (!["task", "complaints"].includes(source)) return null;

  return (
    <div className="flex space-between w-100 text-xs">
      {finalFilters.map(({ label, options }) => {
        return (
          <>
            <div className={"w-1/2"}>
              <span className="text-sm capitalize">{t(`general.${label}`)}</span>
              <Select
                native={false}
                className={"mt-1"}
                onChange={handleFilterChange(label)}
                options={options}
                value={filter[label]}
              />
            </div>
            &nbsp;&nbsp;
          </>
        );
      })}
    </div>
  );
}

export default StatusCategoryServiceFilter;
