import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import _ from "lodash";
import ShadowScrollbars from "react-custom-scrollbars";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import Input from "../../neomorphic/Input";
import Details from "../../../Details";
import EmptyData from "../../EmptyData";
import { _getCorePropsFromNode } from "../../../../helpers/utils";
import NestedList from "../../NestedList";
import { IncidentCategory } from "../../../../constants";
import StatusCategoryServiceFilter from "../../CategoryStatusFilter";

export default function Drilldown({
  source,
  displayFilters,
  leftSideLoading,
  rightSideLoading,
  listData: data,
  listFilterFn: filterFn,
  itemIcon: icon,
  onItemSelect: onSelect,
  activeItemDetails: activeCardDetails = {},
  handleSubmit,
  onUploadDone,
  activeServices = [],
  children: detailActions,
  detailsComp,
  accordionComp,
}) {
  let [filterText, setFilterText] = useState("");
  let [activeTicket, setActiveTicket] = useState({});
  const [filter, setFilter] = useState({});
  const [filteredRecords, setFilteredRecords] = useState([]);

  console.log("activeCardDetails", activeCardDetails);
  console.log("data122", data);

  const records = _.isEmpty(filter) ? data : filteredRecords;

  useEffect(() => {
    if (activeCardDetails?.objectId) {
      let rec = records?.find(
        ({ node }) => activeCardDetails?.objectId === node?.objectId
      );
      if (!rec) return;
      if (rec && rec?.node?.updatedAt !== activeCardDetails?.updatedAt) {
        onSelect(rec?.node);
      } else if (
        source === "task" &&
        rec?.node?.task?.updatedAt !== activeCardDetails?.task?.updatedAt
      ) {
        onSelect(rec?.node);
      }
    } else if (records && records.length) {
      onSelect(records[0]?.node);
    }
  }, [activeCardDetails]);

  function handleChangeFilter(filters) {
    console.log("filters", filterFn(filters) || []);
    setFilteredRecords(filterFn(filters) || []);
    setFilter(filters);
  }

  useEffect(() => {
    if (!_.isEmpty(filter)) {
      setFilteredRecords(filterFn(filter));
    }
  }, [data?.length]);

  const categoryOptions =
    source === "task"
      ? data?.reduce((accumulator, task) => {
          if (!accumulator.includes(task?.node?.task?.category)) {
            accumulator.push({
              label: task?.node?.task?.category,
              value: task?.node?.task?.category,
            });
          }
          return accumulator;
        }, [])
      : Object.keys(IncidentCategory).map((key) => {
          return {
            label: IncidentCategory[key],
            value: key,
          };
        });

  function _getFormattedSourceName(source) {
    if (source === "sr") return "Service Request";
    if (source === "attendance") return "Services";
    else if (source.lastIndexOf("s") > -1) return source;
    else return `${source}s`;
  }

  const hasFilterSection = ["task", "complaints"].includes(source);

  return (
    <div className="flex flex-grow gap-4">
      <div className="w-2/5 shadow-md card bg-base-100 rounded-xl">
        {["task", "complaints"].includes(source) ? (
          <div className="px-4 pt-3">
            <StatusCategoryServiceFilter
              filters={displayFilters}
              source={source}
              services={activeServices}
              records={records}
              onFilterChange={handleChangeFilter}
              categories={categoryOptions}
            />
          </div>
        ) : null}

        <div className="flex justify-between gap-2 px-4 pt-4 lg:flex-row md:flex-row sm:flex-row">
          <Input
            className="w-12 input-sm "
            onChange={({ target: { value } }) => {
              console.log("value", value);
              setFilterText(value);
              setFilteredRecords(filterFn({ text: value }) || []);
            }}
            disabled={!records?.length}
            prefixIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
            value={filterText}
            placeholder="Search..."
          />
        </div>
        {records?.length ? (
          <div className="pt-2 pl-5">
            Showing {filteredRecords.length || records?.length || 0}/
            {data?.length || 0} {_getFormattedSourceName(source)}
          </div>
        ) : null}
        {!leftSideLoading && isEmpty(data) ? (
          <div className="h-[60vh]">
            <EmptyData />
          </div>
        ) : (
          <ShadowScrollbars
            autoHide
            style={{
              height: !hasFilterSection ? "69.5vh" : "80vh",
            }}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            <NestedList
              leftSideLoading={leftSideLoading}
              records={filteredRecords.length ? filteredRecords : records}
              source={source}
              setActiveTicket={setActiveTicket}
              onSelect={onSelect}
              activeTicket={
                activeTicket?.id ? activeTicket : records?.[0]?.node
              }
              icon={icon}
            />
          </ShadowScrollbars>
        )}
      </div>
      <div className="flex w-3/5 shadow-xl bg-base-100 rounded-xl">
        <div className="w-full h-full">
          <Details
            {...{
              selectedRecord: records?.length
                ? {
                    ..._getCorePropsFromNode(activeCardDetails, source),
                    ...activeCardDetails,
                  }
                : {},
              source,
              icon,
              loading: rightSideLoading,
              onSubmit: handleSubmit,
              detailsComp,
              accordionComp,
              onUploadDone: onUploadDone,
              detailActions: records?.length ? detailActions : null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
