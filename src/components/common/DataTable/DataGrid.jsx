import React, { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import moment from "moment";

import HyperlinkCellRenderer from "./HyperlinkCellRenderer";
import CloudArrowDownIcon from "@heroicons/react/24/solid/CloudArrowDownIcon";
import FunnelIcon from "@heroicons/react/24/solid/FunnelIcon";
import Button from "../neomorphic/Button";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import ColumnManager from "../ColumnManager";

const dateValueGetter = (params, v) => {
  const dateString = params.data[params.column.colId];
  const dateFormat = "DD/MM/YYYY";
  return dateString ? moment(dateString, dateFormat).toDate() : null;
};
const dateCellRenderer = (params) => {
  return moment(params.value).format("DD MMM YYYY");
};
const dateTimeCellRenderer = (params) => {
  return params.value
    ? moment(params.value).format("DD MMM YYYY HH:mm:ss")
    : "";
};
const dateColumnDefs = {
  filter: "agDateColumnFilter",
  valueGetter: dateValueGetter,
  cellRenderer: dateCellRenderer,
};
const numberColumnDefs = {
  filter: "agNumberColumnFilter",
};
function formatDateForCSV(date) {
  return moment(date).format("YYYY-MM-DD HH:MM:S");
}
export default function DataGrid({
  columnDefs = [],
  data = [],
  style = {},
  actionComp = () => {},
  name = "Data Table",
  downloadFileName,
  showManageColumns = true,
  loading = false,
  download = true,
  ...props
}) {
  const { theme } = useSelector((state) => state.authSlice);
  const gridApiRef = useRef(null);
  const columnApiRef = useRef(null);
  const gridRef = useRef(null);
  const handleDownloadCSV = () => {
    const params = {
      fileName: `${downloadFileName || name}.csv`,
      processCellCallback: (params) => {
        console.log("processCellCallback", params);
        if (params.column.getColId() === "SR Date Time") {
          return formatDateForCSV(params.value);
        }
        return params.value;

        // Format date if the cell contains a date
        Object.keys(params.node.data).forEach((key) => {
          console.log("key=", key);
          if (key == "createdAt") {
            params.node.data[key] = formatDateForCSV(params.node.data[key]);
          }
        });
        return params.node.data;
      },
    };

    gridApiRef.current.exportDataAsCsv(params);
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    gridApiRef.current.setFilterModel(null);
    gridApiRef.current.onFilterChanged();
  };
  useEffect(() => {
    if (data.length) {
      setTimeout(() => columnApiRef.current?.autoSizeAllColumns(), 200);
    }
  }, [data]);
  useEffect(() => {
    if (gridApiRef && gridApiRef.current) {
      if (loading) gridApiRef.current.showLoadingOverlay();
      else gridApiRef.current.hideOverlay();
    }
  }, [loading]);

  const frameworkComponents = {
    hyperlinkCellRenderer: HyperlinkCellRenderer,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{name}</h2>
        {showManageColumns && gridRef?.current && (
          <ColumnManager gridRef={gridRef} />
        )}
        <div>
          {actionComp(gridApiRef.current)}
          {download ? (
            <Button
              type="outline"
              className="gap-2 mr-2 text-xs btn-sm"
              onClick={handleDownloadCSV}
            >
              <CloudArrowDownIcon className="w-5 h-5" />
              Download CSV
            </Button>
          ) : null}

          <Button
            type="outline"
            className="gap-2 text-xs btn-sm"
            onClick={handleClearFilters}
          >
            <FunnelIcon className="w-5 h-5" />
            Clear
          </Button>
        </div>
      </div>
      <div
        className={`ag-theme-alpine ${
          theme === "dark" ? "ag-theme-alpine-dark" : ""
        }`}
        style={{
          height: `${window.innerHeight - 250}px`,
          width: "100%",
          ...style,
        }}
      >
        <AgGridReact
          columnDefs={columnDefs.map((def) => {
            if (def.type == "date") {
              return { ...dateColumnDefs, ...def };
            } else if (def.type === "datetime") {
              return {
                ...dateColumnDefs,
                cellRenderer: dateTimeCellRenderer,
                ...def,
              };
            } else if (def.type === "number") {
              return { ...numberColumnDefs, ...def };
            } else {
              return def;
            }
          })}
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
            suppressMenu: true,
            resizable: true,
          }}
          rowData={data}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
            columnApiRef.current = params.columnApi;
            gridRef.current = params;
          }}
          {...props}
          onSelectionChanged={(params) => {
            console.log("inside Grid --- parms", params);
            if (props.onSelectionChanged)
              props.onSelectionChanged(params.api.getSelectedRows());
          }}
          frameworkComponents={frameworkComponents}
        />
        <div>{data.length} Rows</div>
      </div>
    </>
  );
}
