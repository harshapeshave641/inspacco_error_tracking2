import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useLazyQuery, useQuery } from "@apollo/client";

import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import ChatBubbleIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import ReceiptPercentIcon from "@heroicons/react/24/outline/ReceiptPercentIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

// import ServiceDetails from "../../../components/Details/ServiceDetails";
import { GET_SOCIETY_SERVICES } from "../../../graphql/queries/getSocietyServices";
import Drilldown from "../../../components/Admin/Drilldown";

import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import { _getCorePropsFromNode, _getStatusType } from "../../../helpers/utils";
import Badge from "../../../components/common/Badge";
import Accordion from "../../../components/common/Accordion";
import DocumentManager from "../../../components/common/DocumentManager";
import Comments from "../../../components/common/Comments";
import Requirements from "../../../components/Details/Requirements";

const AdminServices = () => {
  const [selectedService, setSelectedService] = useState({});
  const [subscribedServices, setSubscribedServices] = useState([]);
  const today = new Date().toISOString();

  let { activeAccountId } = useSelector((state) => state.authSlice);

  const [getActiveServiceServices, { loading: subServiceLoading }] =
    useLazyQuery(GET_SOCIETY_SERVICES, {
      onCompleted: (data) =>
        setSubscribedServices(data.serviceSubscriptions.edges),
      skip: !activeAccountId,
    });

  useEffect(() => {
    getActiveServiceServices({
      variables: {
        societyId: activeAccountId,
        endDate: today,
      },
    });
  }, [activeAccountId]);

  const handleServiceSelection = (node) => setSelectedService(node);

  const filterServiceSubs = ({ text: filterStr }) =>
    subscribedServices?.filter(
      ({ node }) =>
        node.service.name.toLowerCase().indexOf(filterStr.toLowerCase()) > -1
    ) || [];

  return (
    <>
      <div className="container">
        <div className="flex lg:flex-row md:flex-row sm:flex-col">
          <div className="w-full bg-base-200 px-2 pt-4">
            <div className="rounded-xl-tl rounded-xl-bl">
              <Drilldown
                {...{
                  source: "sr",
                  leftSideLoading: subServiceLoading,
                  // rightSideLoading: serviceStaffLoading,
                  listData: subscribedServices,
                  listFilterFn: filterServiceSubs,
                  onItemSelect: (node) => handleServiceSelection(node),
                  detailsComp: (
                    <DetailsHeader
                      data={{
                        ..._getCorePropsFromNode(selectedService, "sr"),
                      }}
                      icon={
                        <CalendarDaysIcon className="w-6 h-6 text-accent" />
                      }
                    />
                  ),
                  accordionComp: <DetailsAccordion data={selectedService} />,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DetailsAccordion = ({ data: selectedRecord }) => {
  const attachmentCount = 0;

  return (
    <Accordion
      data={[
        {
          icon: <ClipboardDocumentCheckIcon className="w-4 h-4" />,
          title: "Requirements",
          content: <Requirements data={selectedRecord.requirement} />,
        },
        {
          icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
          title: `Comments (${selectedRecord?.comments?.edges?.length})`,
          content: (
            <Comments
              edit={true}
              onSubmit={(v) => onSubmit({ ...selectedRecord, comment: v })}
              comments={selectedRecord?.comments?.edges}
            />
          ),
        },
        {
          icon: <ReceiptPercentIcon className="w-4 h-4" />,
          title: `Service Quotations (${
            selectedRecord?.quotations?.edges?.length || 0
          })`,
          content: <Quotations quotes={selectedRecord?.quotations?.edges} />,
        },
        {
          icon: <PaperClipIcon className="w-4 h-4" />,
          title: `Service Quotations Attachments (${attachmentCount})`,
          content: (
            <>
              <DocumentManager
                module={"InspaccoAdmin"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`INSPACC_ADMIN_${selectedRecord?.objectId}`}
                // onUploadDone={onUploadDone}
                // getAttachments={setAttachmentCount}
              />
            </>
          ),
        },
      ]}
    />
  );
};

const DetailsHeader = ({ data: selectedRecord, icon }) => {
  return (
    <div>
      <div className="flex items-center gap-2 pb-2">
        {icon}
        <div className="text-xl text-accent">{selectedRecord.name}</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="inline-flex items-center justify-center gap-2">
          {selectedRecord.priority && (
            <Badge
              text={selectedRecord.priority}
              color={_getPriorityType(selectedRecord.priority)}
            />
          )}
        </div>
        <div className="flex flex-end gap-4 text-accent font-semibold justify-self-end text-sm items-center">
          {selectedRecord.status && (
            <div
              style={{
                color: "white",
                width: 160,

                float: "right",
                position: "relative",
              }}
              className=" justify-end gap-2"
            >
              <Badge
                text={selectedRecord.status
                  ?.split("_")
                  ?.join(" ")
                  ?.replace("SENT", "RECEIVED")}
                color={_getStatusType(selectedRecord.status)}
              />
            </div>
          )}
          <div>
            <label className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4" />
              <span className="text-xs">Updated On</span>
            </label>
            <div className="text-sm text-center font-medium">
              {(selectedRecord.updatedAt &&
                moment(selectedRecord.updatedAt).format("DD MMM YYYY")) ||
                "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
