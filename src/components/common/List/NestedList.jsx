import React, { useState } from "react";

function NestedList({ data = [] }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={item.id} className="list-none">
          <div className="flex items-center">
            <button
              className={`${
                item.subItems && item.subItems.length > 0
                  ? "mr-2 focus:outline-none"
                  : "mr-4"
              }`}
              onClick={toggleExpand}
            >
              {item.subItems && item.subItems.length > 0 ? (
                <span className={`caret ${expanded ? "down" : "right"}`} />
              ) : null}
            </button>
            <div className="font-semibold">{item.summary}</div>
            <div className="text-gray-600">{item.description}</div>
          </div>
          {expanded && item.subItems && item.subItems.length > 0 && (
            <NestedList data={item.subItems} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default NestedList;
