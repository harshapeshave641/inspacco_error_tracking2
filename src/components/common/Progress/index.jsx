import classNames from "classnames";
import React from "react";

function fn(){

}
export default function Progress({ progress, index ,onClick=fn}) {
  const COLORS = ["error", "info", "success"];

  let progressClases = classNames({
    "progress-success": index === 2,
    "progress-info": index === 1,
    "progress-error": index === 0,
  });

  return (
    <progress
      className={`progress ${progressClases} cursor-pointer`}
      value={progress}
      max="100"
      onClick={onClick}
    />
  );
}
