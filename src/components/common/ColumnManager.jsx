// src/ColumnManager.js
import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Button from "./neomorphic/Button";

const ColumnManager = ({ gridRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [columns, setColumns] = useState(
    gridRef?.current?.columnApi.getAllColumns()?.map((col) => {
      return {
        field: col.getColDef().field,
        hide: false,
        headerName: col.getColDef().headerName,
      };
    }) || []
  );
  useEffect(() => {
    setTimeout(() => {
      const updatedColuns =
        gridRef?.current?.columnApi.getAllColumns()?.map((col) => {
          return {
            field: col.getColDef().field,
            hide: false,
            headerName: col.getColDef().headerName,
          };
        }) || [];
      setColumns(updatedColuns);
    }, [300]);
  }, [gridRef.current?.clumnApi]);
  const toggleColumn = (field) => {
    const currentCol = gridRef?.current?.columnApi
      .getAllColumns()
      .find((col) => col.getColDef().field === field);
    if (currentCol) {
      const currentState = gridRef.current.columnApi.getColumnState();
      const colState = currentState.find(
        (state) => state.colId === currentCol.getId()
      );
      colState.hide = !colState.hide;

      gridRef.current.columnApi.applyColumnState({
        state: currentState,
        applyOrder: true,
      });
      setColumns(
        columns?.map((column) => {
          if (column.field === field) {
            column.hide = !column.hide;
          }
          return column;
        })
      );
    }
  };
  function handleAllColumnChange() {
    const allColumns = gridRef.current.columnApi.getAllColumns();
    gridRef.current.columnApi.setColumnsVisible(allColumns, !showAll);
    setColumns(
      columns?.map((column) => {
        column.hide = showAll;
        return column;
      })
    );
    setShowAll(!showAll);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);
  return (
    <div>
      <Button
        type="outline"
        className="gap-2 mr-2 text-xs btn-sm"
        onClick={() => setIsModalOpen(true)}
      >
        <ViewColumnsIcon className="w-5 h-5" />
        Manage Columns
      </Button>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="pt-3 form-control">
              <label className="cursor-pointer label">
                <span className="font-bold label-text">Manage Column</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showAll}
                  onChange={handleAllColumnChange}
                />
              </label>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
            >
              ✕
            </button>
            {columns.map((col) => (
              <div key={col.field} className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">{col.headerName}</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={!col.hide}
                    onChange={() => toggleColumn(col.field)}
                  />
                </label>
              </div>
            ))}
            {/* <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnManager;
