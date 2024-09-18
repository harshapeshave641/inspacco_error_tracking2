import React, { useCallback, useState } from "react";
import _debounce from "lodash/debounce";
import Input from "../neomorphic/Input";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import Button from "../neomorphic/Button";

export default function SearchInput({
  onChange,
  className = "",
  value = "",
  debounced = false,
  placeholder = "Search Product",
  debounceTimeInMs = 500,
  error = "",
  showSearchBtn = false,
}) {
  const [filterValue, setFilterValue] = useState(value);

  let onChangeDebounce = useCallback(
    _debounce((value) => {
      onChange(value);
    }, debounceTimeInMs),
    []
  );

  const _handleSearch = () => onChange(filterValue);

  const _clearSearch = () => onChange("");

  return (
    <>
      <Input
        prefixIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
        placeholder={placeholder}
        error={error}
        value={filterValue}
        onChange={({ target }) => {
          const targetValue = target.value.replaceAll("#", "");
          if (!showSearchBtn) {
            if (debounced) onChangeDebounce(targetValue);
            else onChange(targetValue);
          }
          setFilterValue(targetValue);
        }}
        className={`rounded-full items-center input-sm text-sm font-normal ${className}`}
      />
      {showSearchBtn && (
        <>
          <Button
            className="btn-sm"
            disabled={!filterValue}
            onClick={_handleSearch}
          >
            Search
          </Button>
          <Button
            disabled={!filterValue}
            className="btn-sm"
            type="outline"
            onClick={_clearSearch}
          >
            Clear
          </Button>
        </>
      )}
    </>
  );
}
