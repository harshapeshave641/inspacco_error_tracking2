import React from "react";
import Text from "../../common/Typography/Text";
import ListItem from "../../common/ListItem";

import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import Separator from "../../common/Separator";

export default function HowItWorks({}) {
  return (
    <>
      <Text className="font-medium">How it Works</Text>
      <ListItem
        isCard={false}
        className="px-0"
        title="Provide your requirements"
        description="Answer some questions related to service to provide the detailed requirement"
        icon={
          <div className="rounded-full p-2 bg-accent text-base-100">
            <ClipboardDocumentListIcon className="w-6 h-6" />
          </div>
        }
      />
      <Separator className="divider-horizontal" />
      <ListItem
        isCard={false}
        className="px-0"
        title="Get the best quotation"
        description="Inspacco will provide best possible quotation for your requirement"
        icon={
          <div className="rounded-full p-2 bg-accent text-base-100">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
        }
      />
      <Separator className="divider-horizontal" />
      <ListItem
        isCard={false}
        className="px-0"
        title="Expert Visit"
        description="Inspacco expert will visit the site and explain the complete process for closing the deal"
        icon={
          <div className="rounded-full p-2 bg-accent text-base-100">
            <BriefcaseIcon className="w-6 h-6" />
          </div>
        }
      />
    </>
  );
}
