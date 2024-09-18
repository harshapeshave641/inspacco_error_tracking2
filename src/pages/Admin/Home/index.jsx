import React, { useState } from "react";
import Drilldown from "../../../components/common/Cards/Drilldown";
import DynamicField from "../../../components/common/DynamicField";
import Button from "../../../components/common/neomorphic/Button";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Breadcrumb from "../../../components/common/Breadcrumb";

export default function AdminHome({}) {
  const [formData, setFormData] = useState({});

  const setData = (fieldDataObj) =>
    setFormData({ ...formData, ...fieldDataObj });

  const filtersArr = [
    {
      type: "SELECT",
      label: "Name",
      name: "name",
      setData,
      value: formData.name,
      options: ["some", "some2"],
    },
    {
      type: "TEXT",
      label: "Age",
      name: "age",
      setData,
      value: formData.age,
    },
    {
      type: "SELECT",
      label: "Age",
      name: "age",
      setData,
      value: formData.age,
      options: ["some", "some2"],
    },
  ];

  return (
    <div>
      <div>
        <Breadcrumb path={[{ route: "/", name: "Home" }]} />
      </div>
      <div className="mb-2 bg-base-100 px-4 py-2 rounded-lg">
        <FiltersBar
          filters={filtersArr}
          onSubmit={() => {}}
          onClear={() => setFormData({})}
        />
      </div>
      <Drilldown
        {...{
          // itemIcon: <CalendarIcon className="w-6 h-6 text-accent" />,
          // leftSideLoading: serviceSubsLoading,
          // rightSideLoading: serviceStaffLoading,
          listData: [],
          listFilterFn: () => {},
          onItemSelect: () => {},
          activeItemDetails: {},
        }}
      />
    </div>
  );
}

const FiltersBar = ({ filters, onSubmit, onClear }) => {
  return (
    <div className="flex items-end justify-between">
      <div className="inline-flex gap-2">
        {filters.map((filterObj) => (
          <DynamicField field={filterObj} />
        ))}
      </div>
      <div>
        <Button className="btn-sm mr-2 gap-1" onClick={onSubmit}>
          <MagnifyingGlassIcon className="w-3 h-3" /> Search
        </Button>
        <Button type="ghost" className="btn-sm gap-1" onClick={onClear}>
          <TrashIcon className="w-3 h-3" />
          Clear
        </Button>
      </div>
    </div>
  );
};
