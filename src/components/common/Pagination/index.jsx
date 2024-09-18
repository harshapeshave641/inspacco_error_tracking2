import React, { useState } from "react";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronDoubleLeftIcon from "@heroicons/react/24/outline/ChevronDoubleLeftIcon";
import classNames from "classnames";

import Button from "../neomorphic/Button";

export default function Pagination({
  config,
  className = "",
  compact = false,

  gotoPage,
}) {
  const [gotoPageNum, setGotoPageNum] = useState("");

  const LeftArrow = ({ className }) => (
    <ChevronLeftIcon className={`w-4 h-4 ${className}`} />
  );
  const DoubleLeftArrow = ({ className }) => (
    <ChevronDoubleLeftIcon className={`w-4 h-4 ${className}`} />
  );

  const compactClasses = classNames({
    "btn-sm": compact,
  });

  // const _isNumber = (targetStr) => /[0-9\b]/g.test(targetStr);
 const disabled = config.total_pages == 1;
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="form-control">
        <label
          className={`input-group ${compact ? "input-group-sm text-xs" : ""}`}
        >
          <input
            type="number"
            placeholder="Go to"
            value={gotoPageNum}
            min={1}
            max={config.total_pages}
            onChange={({ target }) => {
              if (
                !target.value ||
                (target.value > 0 && target.value <= config.total_pages)
              )
                setGotoPageNum(target.value);
            }}
            className={`w-[55px] ${
              compact ? "input-sm text-xs" : ""
            } input input-bordered [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          <Button
            className={compact ? "btn-sm" : ""}
            disabled={gotoPageNum == config.current_page || !gotoPageNum}
            onClick={() => gotoPage(gotoPageNum)}
          >
            Go To Page
          </Button>
        </label>
      </div>
      <div
        className={`btn-group ${className} ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <Button
          className={`${compactClasses}`}
          disabled={config.current_page === 1}
          onClick={() => gotoPage(1)}
        >
          <DoubleLeftArrow />
        </Button>
        <Button
          className={`${compactClasses}`}
          disabled={config.current_page === 1}
          onClick={() => gotoPage(config.current_page - 1)}
        >
          <LeftArrow />
        </Button>
        <Button
          className={`${compactClasses} btn-disabled`}
          onClick={() => gotoPage(config.current_page + 1)}
        >
          Page {config.current_page} of {config.total_pages}
        </Button>
        <Button
          className={`${compactClasses}`}
          onClick={() => gotoPage(config.current_page + 1)}
        >
          <LeftArrow className="rotate-180" />
        </Button>
        <Button
          className={`${compactClasses}`}
          onClick={() => gotoPage(config.total_pages)}
        >
          <DoubleLeftArrow className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}
