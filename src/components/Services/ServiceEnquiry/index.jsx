import React from "react";

import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

import View from "../../common/View";
import Card from "../../common/Cards/Card";
import Separator from "../../common/Separator";
import Button from "../../common/neomorphic/Button";
import Text from "../../common/Typography/Text";

export default function ServiceEnquiry({ setShowModal }) {
  const onRequestQuotation = () => setShowModal(true);

  const onScheduleVisit = () => setShowModal(true);

  return (
    <View>
      <div className="flex gap-4 pt-6 justify-center">
        <View className="pt-4">
          <div className="h-full">
            <Card className="w-72 h-full bg-base-200 p-4">
              <View className="flex justify-center gap-2 items-center">
                <DocumentTextIcon className="w-6 h-6" />
                <Text className="font-medium text-accent">
                  {" "}
                  Request a Quotation{" "}
                </Text>
              </View>

              <Separator className="my-1" />
              <View>
                <Text className="text-xs">
                  You will be asked some questions for more clarification on
                  your requirements, and based on the information received from
                  you, we will provide the best compared quotation from our
                  partners.{" "}
                </Text>
              </View>
              <View className="pt-2 inline-flex h-full items-end">
                <Button className="w-full" onClick={onRequestQuotation}>
                  Request
                </Button>
              </View>
            </Card>
          </div>
        </View>
        <View className="pt-4">
          <div className="h-full">
            <Card className="w-72 h-full bg-base-200 p-4">
              <View className="flex justify-center gap-2 items-center">
                <CalendarDaysIcon className="w-6 h-6 " />
                <Text className="font-medium text-accent">
                  {" "}
                  Schedule a Visit{" "}
                </Text>
              </View>
              <Separator className="my-1" />
              <View>
                <Text className="text-xs">
                  Our partner will personally visit your society to gather
                  requirements from you. He will provide you with the best
                  quotation compared to the market price.
                </Text>
              </View>
              <View className="pt-2 inline-flex h-full items-end">
                <Button className="w-full" onClick={onScheduleVisit}>
                  Schedule
                </Button>
              </View>
            </Card>
          </div>
        </View>
      </div>
    </View>
  );
}
