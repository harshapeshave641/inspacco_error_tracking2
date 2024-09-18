import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import DynamicField from "./DynamicField";
import Button from "./neomorphic/Button";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { useEffect, useState } from "react";

const FiltersBar = ({
  filters,
  onSubmit,
  onClear,
  loading = false,
  layout = "horizontal",
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") onSubmit();
    };

    const filterBarElement = document.querySelector(".filter-bar");
    if (filterBarElement)
      filterBarElement.addEventListener("keydown", handleKeyDown);

    return () => {
      if (filterBarElement)
        filterBarElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit]);

  return (
    <div
      className={`flex items-end gap-1 ${
        layout === "vertical" ? "flex-col" : ""
      }`}
    >
      <div
        className={`filter-bar inline-flex ${
          layout === "vertical" ? "flex-col" : ""
        } gap-1 mr-2 w-[85%] overflow-x-scroll overflow-y-hidden`}
      >
        {filters.map((filterObj) => (
          <DynamicField field={filterObj} />
        ))}
      </div>
      <div className="inline-flex gap-0.5">
        <Button
          className="gap-1 mr-2 btn-sm"
          onClick={onSubmit}
          loading={loading}
        >
          <MagnifyingGlassIcon className="w-3 h-3" />
          Search
        </Button>
        <Button type="outline" className="gap-1 btn-sm" onClick={onClear}>
          <TrashIcon className="w-3 h-3" />
          Clear
        </Button>
      </div>
    </div>
  );
};
export default FiltersBar;
