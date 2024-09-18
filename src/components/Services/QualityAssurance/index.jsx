import React from "react";
import Text from "../../common/Typography/Text";
import View from "../../common/View";

import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";

export default function QualityAssurance({ data = [] }) {
  return (
    <>
      <Text className="font-medium">Quality Assurance</Text>
      <div className="mx-4 my-3">
        {data.map((text, index) => {
          return (
            <View
              className="flex my-1 gap-2 items-center justify-start"
              key={index}
            >
              <View>
                <CheckCircleIcon className="text-green-400 w-8 h-8" />
              </View>
              <View>
                <Text className="text-sm">{text}</Text>
              </View>
            </View>
          );
        })}
      </div>
    </>
  );
}
