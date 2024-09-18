import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "../../../components/common/Accordion";

import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import ReceiptPercentIcon from "@heroicons/react/24/outline/ReceiptPercentIcon";
import ChatBubbleIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";

import Requirements from "../../../components/Details/Requirements";
import Comments from "../../../components/common/Comments";
import SingleComment from "../../../components/common/SingleComment";
import Button from "../../../components/common/neomorphic/Button";
import FlatList from "../../../components/common/FlatList";
import {
  _getStatusType,
  getHumanReadableDateTime,
} from "../../../helpers/utils";
import { INR_CURRENCY, SERVICE_REQUEST_ATTACHMENT_TYPES } from "../../../constants";
import Badge from "../../../components/common/Badge";
import DocumentManager from "../../../components/common/DocumentManager";

const DetailsAccordion = ({
  data: selectedRecord,
  onCommentAdd,
  onCreateQuotationClick,
  onOpenQuotationClick,
}) => {
  const [attachmentCountObj,setAttachmentCountObj] = useState({});
  const { isAdmin } = useSelector((state) => state.authSlice);
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
              onSubmit={(v) => onCommentAdd({ ...selectedRecord, comment: v })}
              comments={selectedRecord?.comments?.edges}
            />
          ),
        },
        {
          icon: <ChatBubbleIcon className="w-4 h-4" />,
          title: `Service Resolution Comment ${
            selectedRecord?.resolutionComment ? "" : "(N/A)"
          }`,
          content: isAdmin ? (
            <SingleComment
              id={selectedRecord.objectId}
              comment={selectedRecord?.resolutionComment}
              onSubmit={(v) =>
                onCommentAdd({ ...selectedRecord, resolutionComment: v })
              }
            />
          ) : (
            <span>{selectedRecord?.resolutionComment}</span>
          ),
        },
        {
          icon: <ReceiptPercentIcon className="w-4 h-4" />,
          title: `Quotations (${selectedRecord.quotations.edges.length})`,
          content: (
            <div className="text-right">
              {isAdmin && (
                <Button
                  className="gap-2 mb-2 btn-sm"
                  type="outline"
                  disabled={
                    selectedRecord.quotations.edges.some(({ node }) =>
                      ["OPEN", "ACCEPTED"].includes(node.status)
                    ) || selectedRecord.status === "QUOTATION_APPROVED"
                  }
                  onClick={onCreateQuotationClick}
                >
                  <ReceiptPercentIcon className="w-4 h-4" />
                  Create New Quotation
                </Button>
              )}
              <div>
                <FlatList
                  noDataMsg="There are no quotations!"
                  data={selectedRecord.quotations.edges}
                  renderItem={({ item: { node }, index }) => (
                    <div
                      onClick={(event) =>
                        onOpenQuotationClick(
                          node,
                          selectedRecord.quotations.edges.length - index
                        )
                      }
                      className={`
                        shadow hover:bg-base-300 bg-base-100 p-4 flex text-highlight cursor-pointer duration-300 transition-all items-center my-1 rounded-lg`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <ReceiptPercentIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <div className="font-semibold">
                            #Quotation{" "}
                            {selectedRecord.quotations.edges.length - index}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          <Badge
                            text={node.status}
                            color={_getStatusType(node.status)}
                          />
                        </div>
                        <div className="">
                          <label className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span className="text-xs">Created On</span>
                          </label>
                          <div className="text-xs font-medium text-center">
                            {getHumanReadableDateTime(node.createdAt)}
                          </div>
                        </div>
                        <div className="">
                          <label className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span className="text-xs">Updated On</span>
                          </label>
                          <div className="text-xs font-medium text-center">
                            {/* {moment(node.createdAt).format("DD MMM YYYY")} */}
                            {getHumanReadableDateTime(node.updatedAt)}
                          </div>
                        </div>
                        <div className="text-sm right">
                          {INR_CURRENCY} {node?.actualAmount}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          ),
        },
        ...(SERVICE_REQUEST_ATTACHMENT_TYPES?.map(obj=>{
          return {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `${obj.label} (${attachmentCountObj[obj?.value] || 0})`,
            content: (
              <DocumentManager
                module={obj.value}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`${obj?.permissionGroupIdPrefix}${selectedRecord?.objectId}`}
                // onUploadDone={onUploadDone}
                getAttachments={(attachs) =>setAttachmentCountObj(prvObj=>({...prvObj,[obj?.value]:attachs?.length}))}
              />
            ),
          }
        }))
      ]}
    />
  );
};

export default DetailsAccordion;
