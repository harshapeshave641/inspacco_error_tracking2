import React from "react";
import EmptyData from "../EmptyData";
import classNames from "classnames";
// import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
// import { useTranslation } from "react-i18next";

const AccordionItem = ({
  index,
  acc,
  arr,
  flush,
  showPlusIcon,
  compact,
  itemClassName,
}) => {
  const itemClasses = classNames(itemClassName, {
    "collapse-arrow": !showPlusIcon,
    "collapse-plus": showPlusIcon,
    "border-base-300 border-t": flush,
    "bg-base-200 rounded-lg mb-1 border-base-100": !flush,
  });

  const titleClasses = classNames({
    "text-sm !min-h-[10px] !h-10 items-center": compact,
    "after:!top-[5px]": compact && !flush,
    "after:!text-lg": showPlusIcon,
    "text-lg": !compact,
  });
  // const {t} = useTranslation()
  // console.log('title',acc.title)
  // const [langLabel,...rest] = acc?.title?.split(' ')
  // const countText = rest?.join(' ')
  return (
    <div
      tabIndex={index}
      className={`collapse ${itemClasses} rounded ${
        index === arr.length - 1 && flush ? "border-b" : ""
      }`}
    >
      <input type="checkbox" className={`${titleClasses}`} />
      <div className={`collapse-title text-accent flex ${titleClasses}`}>
        <div className="mt-2 mr-2">{acc.icon ? acc.icon : null}</div>
        {acc.title}
      </div>
      <div
        tabIndex={index}
        className="collapse-content border-t-2 border-base-100"
      >
        <div className="pt-2">{acc.content || <EmptyData />}</div>
      </div>
    </div>
  );
};

export default function Accordion({
  data = [],
  name = "my-accordion-1",
  className,
  compact = false,
  showPlusIcon = false,
  flush = false,
  itemClassName = "",
}) {
  return (
    <div className={`${className} w-full`}>
      {data
        .filter((a) => a)
        ?.map((acc, index, arr) => (
          <AccordionItem
            {...{
              acc,
              index,
              arr,
              name,
              flush,
              compact,
              showPlusIcon,
              itemClassName,
            }}
          />
        ))}
    </div>
  );
}
