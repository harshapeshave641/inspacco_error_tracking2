import React, { useEffect, useState } from "react";
import DynamicField from "../DynamicField";
import EmptyData from "../EmptyData";

export default function FlatList({
  data = [],
  renderItem: RenderItem,
  keyExtractor,
  loading,
  showSearchBar = false,
  noDataComp = null,
  noDataMsg = "No Data",
}) {
  const [filteredRecords, setFilteredRecords] = useState(data);
  const [searchTerm, setSearchTerm] = useState(null);

  if (showSearchBar) {
    useEffect(() => {
      if (searchTerm && searchTerm?.trim()) {
        setFilteredRecords(
          data?.filter((obj) => {
            return Object.values(obj)?.some((a) => {
              if (typeof a === "string") {
                return a.toLowerCase().includes(searchTerm.toLowerCase());
              }
              return false;
            });
          })
        );
      } else {
        setFilteredRecords(data);
      }
    }, [searchTerm]);
  }

  useEffect(() => {
    setFilteredRecords(data);
  }, [data]);

  if (!filteredRecords.length)
    return noDataComp || <EmptyData msg={noDataMsg} />;

  return (
    <>
      {showSearchBar ? (
        <div className="pb-4 pr-14">
          <DynamicField
            field={{
              name: "name",
              label: "Search",
              type: "text",
              value: searchTerm,
              placeholder: "Search by name",
              setData: (a) => setSearchTerm(a?.name),
            }}
          />
        </div>
      ) : null}
      <div className="gap-2 overflow-y-auto">
        {filteredRecords.map((item, index) => (
          <RenderItem key={index} {...{ item, index }} />
        ))}
      </div>
    </>
  );
}
