import React from "react";
import { isObject } from "lodash";
import Text from "../Typography/Text";

export default function LabelValue({ label, value }) {
  return (
    <div className="flex flex-col">
      <Text className="text-sm pb-1 font-semibold text-accent">{label}</Text>
      <Text className="text-sm">{isObject(value) ? value.label : value}</Text>
    </div>
  );
}
