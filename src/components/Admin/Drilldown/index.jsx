import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import _upperFirst from "lodash/upperFirst";
import ShadowScrollbars from "react-custom-scrollbars";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import Details from "../../Details/Details";
import EmptyData from "../../../components/common/EmptyData";
import NestedList from "../../../components/common/NestedList";
import Input from "../../../components/common/neomorphic/Input";
import StatusCategoryServiceFilter from "../../../components/common/CategoryStatusFilter";

import { _getCorePropsFromNode } from "../../../helpers/utils";
import { IncidentCategory, PAGE_LIMIT } from "../../../constants";
import Skeleton from "../../common/Skeleton";
import Pagination from "../../common/Pagination";

function fn() {}

export default function Drilldown({
  source,
  filters,
  leftSideLoading,
  listData: data = [],
  listFilterFn: filterFn,
  rightSideLoading,
  itemIcon: icon,
  onItemSelect: onSelect,
  activeItemDetails: activeCardDetails = {},
  activeServices = [],
  details_header,
  details_content,
  children: detailActions,
  paginationConfig = { current_page: 0, total_pages: 0 },
  pagination = false,
  onPageChange = fn,
  showSearch = false,
  actionsComp,
}) {
  let [filterText, setFilterText] = useState("");
  let [activeTicket, setActiveTicket] = useState({});
  const [filter, setFilter] = useState({});
  const [filteredRecords, setFilteredRecords] = useState([]);

  const records = isEmpty(filter) ? data : filteredRecords;

  // useEffect(() => {
  //   if (activeCardDetails?.objectId) {
  //     let rec = records?.find(
  //       ({ node }) => activeCardDetails?.objectId === node?.objectId
  //     );
  //     if (!rec) return;
  //     if (rec && rec?.node?.updatedAt !== activeCardDetails?.updatedAt) {
  //       onSelect(rec?.node);
  //     }
  //   } else if (records && records.length) {
  //     onSelect(records[0]?.node);
  //   }
  // }, [activeCardDetails]);

  function handleChangeFilter(filters) {
    setFilteredRecords(filterFn(filters) || []);
    setFilter(filters);
  }

  useEffect(() => {
    if (!isEmpty(filter)) setFilteredRecords(filterFn(filter));

    if (data?.length) {
      const selected = data?.find(
        (obj) => obj?.node?.objectId == activeTicket?.objectId
      );
      // console.log('!selected',selected)
      if (!selected) {
        setActiveTicket(data?.[0]?.node);
        onSelect(data?.[0]?.node);
      }
    }
  }, [data]);

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

  const hasFilterSection = false; //["task", "complaints"].includes(source);

  return (
    <>
      <div className="flex flex-grow gap-4">
        <div className="w-2/5 shadow-md card bg-base-100 rounded-xl">
          <div className="px-4 pt-3">
            {hasFilterSection && (
              <StatusCategoryServiceFilter
                filters={filters}
                source={source}
                services={activeServices}
                records={records}
                onFilterChange={handleChangeFilter}
                categories={categoryOptions}
              />
            )}
          </div>

          {showSearch ? (
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
          ) : null}
          {records?.length && !pagination ? (
            <div className="pt-2 pl-5">
              Showing {filteredRecords.length || records?.length || 0}/
              {data?.length || 0} {_getFormattedSourceName(source)}
            </div>
          ) : (
            <div className="pt-2 pl-5">
              Showing {data.length}/{paginationConfig?.total_pages * PAGE_LIMIT}{" "}
              {_getFormattedSourceName(source)}s
            </div>
          )}
          {!leftSideLoading && isEmpty(data) ? (
            <div className="h-[60vh]">
              <EmptyData />
            </div>
          ) : (
            <ShadowScrollbars
              autoHide
              style={{
                minHeight: !hasFilterSection ? "65vh" : "80vh",
                // height:'auto'
                // minHeight:'550px'
              }}
              autoHideTimeout={1000}
              autoHideDuration={200}
            >
              <NestedList
                leftSideLoading={leftSideLoading}
                records={filteredRecords.length ? filteredRecords : records}
                source={source}
                setActiveTicket={(node) => {
                  setActiveTicket(node);
                  onSelect(node);
                }}
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
            {rightSideLoading ? (
              <Skeleton />
            ) : !activeTicket.id ? (
              <EmptyData />
            ) : (
              <Details
                {...{
                  header: `${_upperFirst(
                    _getFormattedSourceName(source)
                  )} Details`,
                  details_header,
                  details_content,
                  actionsComp,
                }}
              />
            )}
          </div>
        </div>
      </div>
      {pagination && paginationConfig.total_pages > 1 ? (
        <div className="flex justify-center w-full mt-2">
          <Pagination
            compact
            gotoPage={onPageChange}
            className="float-right shadow-lg"
            config={paginationConfig}
          />
          {paginationConfig.showRecords && (
            <div className="ml-4">
              {paginationConfig?.total_pages * PAGE_LIMIT} {"records"}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
