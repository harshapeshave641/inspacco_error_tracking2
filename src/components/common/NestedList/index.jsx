import { useState } from "react";
import Ticket from "../Ticket";
import { _getCorePropsFromNode } from "../../../helpers/utils";
import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";

export default function NestedList({
  icon,
  leftSideLoading,
  records = [],
  source,
  activeTicket,
  setActiveTicket,
  onSelect,
  isSubTasks = false,
}) {
  console.log("records", records);
  const [expanded, setExpanded] = useState(true);

  return (
    <ul role="list" className="px-4">
      {leftSideLoading ? (
        <Skeleton />
      ) : (
        records.map(({ node }, index) => (
          <li key={index} className="my-2 group">
            <div className="flex justify-between">
              <Ticket
                expanded={expanded}
                btnText={source === "attendance" ? "Mark Attendance" : ""}
                onClick={(node) => {
                  setActiveTicket(node);
                  if (onSelect) onSelect(node);
                }}
                {...{
                  data: {
                    ..._getCorePropsFromNode(node, source),
                    node,
                  },
                  active: activeTicket.id === node.id,
                  icon,
                }}
              />
            </div>
            {expanded && node.subItems && node.subItems.length > 0 && (
              <div className="flex full-width">
                <div className="cursor-pointer divider divider-horizontal"></div>
                <NestedList
                  records={node.subItems}
                  source={source}
                  activeTicket={activeTicket}
                  onSelect={onSelect}
                  setActiveTicket={setActiveTicket}
                  icon={<RectangleGroupIcon className="h-5 w-5-" />}
                  isSubTasks={true}
                />
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  );
}

const Skeleton = () => {
  return (
    <div role="status" class="animate-pulse flex flex-col gap-2">
      <div class="h-16 bg-base-300 rounded"></div>
      <div class="h-16 bg-base-300 rounded"></div>
      <div class="h-16 bg-base-300 rounded"></div>
      <div class="h-16 bg-base-300 rounded"></div>
      <div class="h-16 bg-base-300 rounded"></div>
      <div class="h-16 bg-base-300 rounded"></div>
    </div>
  );
};
