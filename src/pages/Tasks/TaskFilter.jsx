import React, { useEffect, useState } from "react";
import Select from "../../components/common/neomorphic/Select";
import { useSelector } from "react-redux";
import {
  TaskStatus,
  getStatusOptions,
  taskStatusOptions,
} from "../../constants";
import { getActiveServicesOptions } from "../../helpers/utils";

function TaskFilter({
  source,
  records = [],
  onFilterChange,
  services = [],
  categories = [],
}) {
  let { activeAccountId } = useSelector((state) => state.authSlice);
  console.log("services", services);
  const [filter, setFilter] = useState({
    category: "all",
    service: "all",
    status: "ALL",
  });

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

  if (!["task", "complaints"].includes(source)) {
    return <></>;
  }

  return (
    <div className="flex space-between w-100 text-xs">
      <div className={"w-1/2"}>
        <span className="text-sm">Status</span>
        <Select
          disabled={!records.length}
          native={false}
          className={"mt-1"}
          onChange={handleFilterChange("status")}
          options={[
            { label: "All", value: "ALL" },
            ...getStatusOptions(source),
          ]}
          value={filter.status}
        />
      </div>
      &nbsp;&nbsp;
      <div className={"w-1/2"}>
        <span className="text-sm">Service</span>
        <Select
          native={false}
          disabled={!records.length}
          className={"mt-1"}
          onChange={handleFilterChange("service")}
          options={[{ label: "All", value: "all" }, ...services]}
          value={filter.service}
        />
      </div>
      &nbsp;&nbsp;
      <div className={"w-1/2"}>
        <span className="text-sm">Category</span>
        <Select
          disabled={!records.length}
          className={"mt-1"}
          native={false}
          onChange={handleFilterChange("category")}
          options={[{ label: "All", value: "all" }, ...categories]}
          value={filter.category}
        />
      </div>
    </div>
  );
}

export default TaskFilter;
