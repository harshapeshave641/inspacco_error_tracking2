import React, { useEffect, useState } from "react";
import { isEmpty, isObject } from "lodash";
import moment from "moment";

import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import ChatBubbleIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import ReceiptPercentIcon from "@heroicons/react/24/outline/ReceiptPercentIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

import Badge from "../common/Badge";
import Accordion from "../common/Accordion";
import EmptyData from "../common/EmptyData";

import AttendanceMarkingDetailView from "../Attendance/AttendanceMarkingDetailView.js";
import ReactiveInput from "../common/neomorphic/ReactiveInput";
import Button from "../common/neomorphic/Button";
import Select from "../common/neomorphic/Select";
import { getStatusOptions, priorityOptions } from "../../constants";

import { _getPriorityType, _getStatusType } from "../../helpers/utils";
import DocumentManager from "../common/DocumentManager";
import Comments from "../common/Comments";
import SingleComment from "../common/SingleComment.jsx";

const Description = ({ children }) => (
  <div>{children || <EmptyData msg="There is no description." />}</div>
);

const Quotations = ({ quotes = [] }) => {
  if (!quotes.length) return <EmptyData msg="There are no quotations." />;
  return (
    <div>
      {quotes.map(({ node }, qIndex) => {
        const {
          __typename,
          id,
          objectId,
          createdAt,
          updatedAt,
          ...quotationOBj
        } = node;
        return (
          <table className="table w-full text-sm" key={qIndex}>
            <tbody>
              <tr>
                <td colSpan="2">Quotation {qIndex + 1}</td>
              </tr>
              {Object.entries(quotationOBj)
                .filter(([, entry]) => !isObject(entry))
                .map(([key, entry], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{entry}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

const Requirements = ({ data = [] }) => {
  if (data === null) {
    data = `[]`;
  }
  let parsedData = !isEmpty(data) ? JSON.parse(data) : [];
  if (!data.length) return <EmptyData msg="There are no requirements." />;

  return (
    <div className="grid grid-cols-2 gap-6 w-[80%] mx-auto mt-4">
      {parsedData
        ?.filter((a) => a)
        ?.map(({ fields }) =>
          fields
            ?.filter((a) => a)
            ?.map(({ label, value }) => (
              <div>
                <div className="text-sm font-semibold label-text">{label}</div>
                <div className="text-sm label-text">{value || "-"}</div>
              </div>
            ))
        )}
    </div>
  );
};

const Skeleton = () => {
  return (
    <div role="status" class="animate-pulse">
      <div class="h-4 bg-base-300 rounded-full mb-4"></div>
      <div className="animate-pulse">
        <div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
        </div>
        <div>
          <div class="h-52 mt-8 bg-base-300 rounded mb-2.5"></div>
        </div>
      </div>
    </div>
  );
};



function fn() {}

export default function Details({
  header = "",
  selectedRecord,
  loading,
  source,
  icon,
  onSubmit = fn,
  onUploadDone = fn,
  detailsComp,
  detailActions,
}) {
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [attachments1Count, setAttachments1Count] = useState(0); //]
  const [requestAttachmentCount, setRequestAttachmentCount] = useState(0); //
  const [
    requestCompletionAttachmentCount,
    setRequestCompletionAttachmentCount,
  ] = useState(0); //
  const [otherAttachmentsCount, setOtherAttachmentsCount] = useState(0);
  const _getAccordionFromSource = (source) => {
    switch (source) {
      case "task":
        return [
          {
            icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
            title: "Description",
            content: (
              <Description>{selectedRecord.task.description}</Description>
            ),
          },
          {
            icon: <ChatBubbleIcon className="w-4 h-4" />,
            title: `Comment ${selectedRecord?.comment ? "" : "(N/A)"}`,
            content: (
              <SingleComment
                id={selectedRecord.objectId}
                comment={selectedRecord?.comment}
                onSubmit={(v) => onSubmit({ ...selectedRecord, comment: v })}
              />
            ),
          },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `Documents (${attachmentCount})`,
            content: (
              <>
                <DocumentManager
                  module={"Service_TaskActivity_Photos"}
                  parentId={selectedRecord?.objectId}
                  permissionGroupId={`SOCIETY_${selectedRecord?.serviceSubscription?.society?.objectId}`}
                  onUploadDone={onUploadDone}
                  getAttachments={(attachs) =>
                    setAttachmentCount(attachs?.length)
                  }
                />
              </>
            ),
          },
        ];
      case "complaints":
        return [
          {
            icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
            title: `Comments (${selectedRecord?.comments?.edges?.length || 0})`,
            content: (
              <Comments
                edit={true}
                onSubmit={(v) => onSubmit({ ...selectedRecord, comment: v })}
                comments={selectedRecord?.comments?.edges}
              />
            ),
          },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `Attachments (${attachmentCount})`,
            content: (
              <>
                <DocumentManager
                  module={"Service_Incident_Photos"}
                  parentId={selectedRecord?.objectId}
                  permissionGroupId={`SOCIETY_${selectedRecord?.serviceSubscription?.society?.objectId}|PARTNER_${selectedRecord?.serviceSubscription?.partner?.objectId}`}
                  onUploadDone={onUploadDone}
                  getAttachments={(attachs) =>
                    setAttachmentCount(attachs?.length)
                  }
                />
                {/* <ManageAttachment
                  module={"Service_Incident_Photos"}
                  parentId={selectedRecord?.objectId}
                  permissionGroupId={`SOCIETY_${selectedRecord?.serviceSubscription?.society?.objectId}|PARTNER_${selectedRecord?.serviceSubscription?.partner?.objectId}`}
                  onUploadDone={onUploadDone}
                />
                <DocumentViewer
                  attachments={selectedRecord?.attachments?.edges?.map(
                    (att) => att.node
                  )}
                /> */}
              </>
            ),
          },
        ];
      case "attendance":
        return [];
      default:
        return [
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
            icon: <ChatBubbleIcon className="w-4 h-4" />,
            title: ` Service Resolution Comment ${
              selectedRecord?.resolutionComment ? "" : "(N/A)"
            }`,
            content: (
              <span>{selectedRecord?.resolutionComment}</span>
              // <SingleComment
              //   id={selectedRecord.objectId}
              //   comment={selectedRecord?.resolutionComment}
              //   onSubmit={(v) =>
              //     onSubmit({ ...selectedRecord, resolutionComment: v })
              //   }
              // />
            ),
          },
          // {
          //   icon: <ReceiptPercentIcon className="w-4 h-4" />,
          //   title: `Service Quotations (${
          //     selectedRecord?.quotations?.edges?.length || 0
          //   })`,
          //   content: <Quotations quotes={selectedRecord?.quotations?.edges} />,
          // },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `Service Request Attachments (${requestAttachmentCount})`,
            content: (
              <DocumentManager
                module={"SERVICE_REQUEST_CREATION_ATTACHMENT"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`INSPACC_ADMIN_ATTACHMENTS_${selectedRecord?.objectId}`}
                onUploadDone={onUploadDone}
                getAttachments={(attachs) =>
                  setRequestAttachmentCount(attachs?.length)
                }
              />
            ),
          },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: ` Quotations Attachments (${attachmentCount})`,
            content: (
              <DocumentManager
                module={"InspaccoAdmin"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`INSPACC_ADMIN_${selectedRecord?.objectId}`}
                onUploadDone={onUploadDone}
                getAttachments={(attachs) =>
                  setAttachmentCount(attachs?.length)
                }
              />
            ),
          },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `Completion Attachments (${requestCompletionAttachmentCount})`,
            content: (
              <DocumentManager
                module={"SERVICE_REQUEST_RESOLUTION_ATTACHMENT"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`INSPACC_ADMIN_${selectedRecord?.objectId}`}
                onUploadDone={onUploadDone}
                getAttachments={(attachs) =>
                  setRequestCompletionAttachmentCount(attachs?.length)
                }
              />
            ),
          },
          {
            icon: <PaperClipIcon className="w-4 h-4" />,
            title: `Other Attachments (${otherAttachmentsCount})`,
            content: (
              <DocumentManager
                module={"SERVICE_REQUEST_OTHER_ATTACHMENT"}
                parentId={selectedRecord?.objectId}
                permissionGroupId={`INSPACC_ADMIN_${selectedRecord?.objectId}`}
                onUploadDone={onUploadDone}
                getAttachments={(attachs) =>
                  setOtherAttachmentsCount(attachs?.length)
                }
              />
            ),
          },
        ];
    }
  };

  function handleStatusChange(v) {
    console.log("v=>", v);
    onSubmit({ ...selectedRecord, status: v });
  }

  return (
    <div className="p-4">
      <div className="">
        <div className="flex">
          <div className="text-lg font-semibold">
            {header
              ? header
              : source === "attendance"
              ? "Mark Attendance"
              : "Details"}
            {detailActions ? detailActions : null}
          </div>
        </div>
        <div className="my-1 divider"></div>
        {!loading && !selectedRecord.id ? (
          <EmptyData />
        ) : (
          <div className="w-[98%] mx-auto">
            <div>
              {!selectedRecord.id ? (
                <Skeleton />
              ) : (
                <div>
                  <div>
                    <div className="flex items-center gap-2 pb-2">
                      {icon}
                      <div className="text-xl text-accent">
                        {selectedRecord.name}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center justify-center gap-2">
                        {/* {selectedRecord.status && (
                          <Badge
                            text={selectedRecord.status}
                            color={_getStatusType(selectedRecord.status)}
                          />
                        )} */}
                        {/* {selectedRecord.priority && (
                          <Badge
                            text={selectedRecord.priority}
                            color={_getPriorityType(selectedRecord.priority)}
                          />
                        )} */}
                        {source === "sr" || source === "complaints" ? (
                          <Select
                            native={true}
                            className={
                              `btn-sm w-40 }` + ""
                            }
                            onChange={(v) =>
                              onSubmit({ ...selectedRecord, priority: v })
                            }
                            options={priorityOptions}
                            value={selectedRecord?.priority}
                          />
                        ) : null}
                      </div>
                      <div  className="flex items-center gap-4 text-sm font-semibold text-accent justify-self-end">
                        {selectedRecord.status && (
                          <div
                            style={{
                              color: "white",
                              // width: 160,

                              float: "right",
                              position: "relative",
                              // maxWidth:'200px'
                            }}
                            className="justify-end gap-2 "
                          >
                            {(source !== "task" ) &&
                            selectedRecord.status === "COMPLETED"  || source == 'sr' ? (
                              <Badge
                                text={selectedRecord.status
                                  ?.split("_")
                                  ?.join(" ")
                                  ?.replace("SENT", "RECEIVED")}
                                color={_getStatusType(selectedRecord.status)}
                              />
                            ) : (
                              <Select
                                native={true}
                                className={
                                  `btn-sm bg-${_getStatusType(
                                    selectedRecord?.status,
                                    true
                                  )}` + ""
                                }
                                style={{color:_getStatusType(
                                  selectedRecord?.status,
                                  true
                                )}}
                                onChange={handleStatusChange}
                                options={getStatusOptions(source)}
                                value={selectedRecord?.status}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="">
                        <label className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span className="text-xs">Updated On</span>
                        </label>
                        <div className="text-sm font-medium text-center">
                          {source === "attendance"
                            ? moment(selectedRecord.selectedDate).format(
                                "DD MMM YYYY"
                              )
                            : (selectedRecord.updatedAt &&
                                moment(selectedRecord.updatedAt).format(
                                  "DD MMM YYYY h:mm A"
                                )) ||
                              "N/A"}
                        </div>
                      </div>
                    </div>
                    {source !== "attendance" &&
                      selectedRecord?.serviceSubscription?.service?.name && (
                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <div>
                            <label className="">
                              <span className="label-text">Service</span>
                            </label>
                            <div className="text-sm font-medium">
                              {
                                selectedRecord?.serviceSubscription?.service
                                  ?.name
                              }
                            </div>
                          </div>
                          <div className="">
                            <label className="">
                              <span className="label-text">
                                {source === "task" ? "Created By" : "Requester"}
                              </span>
                            </label>
                            <div className="text-sm font-medium">
                              {selectedRecord.requester?.firstName}{" "}
                              {selectedRecord.requester?.lastName}
                            </div>
                          </div>
                          {source === "complaints" && (
                            <>
                              <div>
                                <label className="">
                                  <span className="label-text">
                                    Assigned To
                                  </span>
                                </label>
                                <div className="text-sm font-medium">
                                  {selectedRecord?.assignee?.firstName}{" "}
                                  {selectedRecord?.assignee?.lastName}
                                </div>
                              </div>
                              <div>
                                <label className="">
                                  <span className="label-text">Category</span>
                                </label>
                                <div className="text-sm font-medium">
                                  {selectedRecord.category}
                                </div>
                              </div>
                            </>
                          )}
                          {source === "task" && (
                            <>
                              <div>
                                <label className="">
                                  <span className="label-text">Due Date</span>
                                </label>
                                <div className="text-sm font-medium">
                                  {selectedRecord.taskDate &&
                                    moment(selectedRecord.taskDate).format(
                                      "DD MMM YYYY"
                                    )}
                                </div>
                              </div>
                              <div>
                                <label className="">
                                  <span className="label-text">Category</span>
                                </label>
                                <div className="text-sm font-medium">
                                  <kbd className="kbd kbd-sm">
                                    {" "}
                                    {selectedRecord.category}
                                  </kbd>
                                </div>
                              </div>
                            </>
                          )}
                          {source === "task" && (
                            <>
                              <div>
                                <label className="">
                                  <span className="label-text">
                                    Assigned To
                                  </span>
                                </label>
                                <div className="text-sm font-medium">
                                  {selectedRecord.task?.assignedTo?.firstName}{" "}
                                  {selectedRecord.task?.assignedTo?.lastName}
                                </div>
                              </div>
                              <div>
                                <label className="">
                                  <span className="label-text">Frequency</span>
                                </label>
                                <div className="text-sm font-medium">
                                  {selectedRecord.task?.frequency}
                                </div>
                              </div>
                            </>
                          )}
                          {source === "services" && (
                            <div>
                              <Button type="accent" className="btn-sm">
                                <PlusCircleIcon className="w-4 h-4 mr-1" />
                                <span>Add Staff</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div>
                    {source === "attendance" && (
                      <AttendanceMarkingDetailView
                        selectedRecord={selectedRecord}
                        loading={loading}
                      />
                    )}
                  </div>
                  {detailsComp ? <div>{detailsComp}</div> : null}
                  <div className="pt-6 rounded">
                    <Accordion data={_getAccordionFromSource(source)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
