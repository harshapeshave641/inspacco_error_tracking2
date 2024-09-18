import React from "react";

const Table = ({ columns, data, wrapperClass }) => {
  return (
    <div className={`overflow-x-auto ${wrapperClass}`}>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th className="text-[11px] font-normal capitalize">
                  {column.name.split("_").join(" ")}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr>
                {columns.map((column, index) => {
                  return (
                    <td className="text-[11px]" key={index}>
                      {column.selector(row)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
