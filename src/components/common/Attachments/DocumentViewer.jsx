import React, { useState } from "react";

import env from "../../../env";
import EmptyData from "../EmptyData";
import Modal from "../Modal";
import Button from "../neomorphic/Button";
import { isImage } from "../../../helpers/utils";
import DocumentItem from "./DocumentItem";
import moment from "moment";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import _ from "lodash";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { useMutation } from "@apollo/client";
import { DELETE_ATTACHMENT } from "../../../graphql/mutations/attachment";
import { toast } from "react-toastify";
import ConfirmationWrapper from "../Dialog/ConfirmationWrapper";
const DocumentViewer = ({ attachments = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  let { serverURL, appId } = env;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState({});
  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT);
  const openModal = (fileUrl, index) => {
    setSelectedAttachment(fileUrl);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAttachment("");
    setModalOpen(false);
  };
  function handlePrevNext(action) {
    let updatedIndex = selectedIndex;
    console.log("selectedIndex", selectedIndex);
    if (action == "prev") {
      if (attachments.length && selectedIndex > 0) {
        updatedIndex = selectedIndex - 1;
      }
    } else {
      if (attachments.length && selectedIndex < attachments.length - 1) {
        updatedIndex = selectedIndex + 1;
      }
    }
    if (attachments[updatedIndex]) {
      setSelectedAttachment(attachments[updatedIndex]);
      setSelectedIndex(updatedIndex);
    }
  }
  if (_.isEmpty(attachments))
    return <EmptyData msg="There are no attachments." />;

  async function handleDeleteAttachment(attachment) {
    await deleteAttachment({
      variables: {
        id: attachment?.objectId,
      },
    });
    toast.success(`Attachment ${attachment.fileName} Deleted`);
    if (typeof onChange == "function") {
      onChange();
    }
  }
  return (
    <div style={{ paddingTop: 10 }}>
      <div className="grid grid-cols-2">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="card w-full items-center flex  border-white cursor-pointer max-h-full p-1.5"
          >
            <div className="flex ">
              <div
                className="inline-flex items-center"
                onClick={(e) => {
                  // e.preventDefault()
                  if (isImage(attachment.url)) openModal(attachment, index);
                }}
              >
                {isImage(attachment.url) ? (
                  <div className="flex hover:bg-base-300 cursor-pointer transition-all duration-300 items-center w-48 rounded-md hover:bg-base-30 bg-base-100">
                    <img
                      src={`${serverURL}/files/${appId}/${attachment.url}`}
                      alt={`Image ${index}`}
                      className="w-12 h-12 rounded-lg p-1 mr-1"
                    />
                    <span className="text-xs font-medium">
                      {attachment.fileName}
                    </span>
                  </div>
                ) : (
                  <DocumentItem
                    key={attachment.objectId}
                    title={attachment.name}
                    fileName={`${++index}_${attachment.fileName}`}
                    date={moment(attachment.updatedAt).format("MMMM Do YYYY")}
                    url={attachment.url}
                    openUrl={true}
                  />
                )}
              </div>
              <div className="text-danger mt-3 ml-2">
                <ConfirmationWrapper
                  onConfirm={() => {
                    handleDeleteAttachment(attachment);
                  }}
                  confirmationMessage={`Are you Sure,you want to delete attachment ${attachment?.name}?`}
                >
                  <TrashIcon className="ml-1 w-5 h-5 text-error " />
                </ConfirmationWrapper>
              </div>
            </div>
            <div className="text-[10px] font-semibold">
              {moment(attachment.createdAt).format("DD MMM YYYY hh:mm A")}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal
          showModal={modalOpen}
          closeModal={closeModal}
          fullscreen
          title={selectedAttachment.name}
        >
          <div className="p-4 h-screen flex items-center justify-center">
            <div style={leftArrowStyle}>
              <ChevronLeftIcon
                style={iconStyle}
                onClick={(e) => handlePrevNext("prev")}
              />
            </div>
            <div>
              {isImage(selectedAttachment.url) ? (
                <img
                  src={`${serverURL}/files/${appId}/${selectedAttachment.url}`}
                  alt="Selected Image"
                  className="w-auto h-screen"
                />
              ) : (
                <DocumentItem
                  key={selectedAttachment.objectId}
                  title={selectedAttachment.name}
                  fileName={`${selectedAttachment.fileName}`}
                  date={moment(selectedAttachment.updatedAt).format(
                    "MMMM Do YYYY"
                  )}
                  url={selectedAttachment.url}
                  openUrl={true}
                />
              )}
            </div>
            <div style={rightArrowStyle}>
              <ChevronRightIcon
                style={iconStyle}
                onClick={(e) => handlePrevNext("next")}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  width: "100%",
  height: "50px", // Adjust the height as needed
  backgroundColor: "#eaeaea", // Background color for the container
};

const leftArrowStyle = {
  position: "absolute",
  left: "40px",
};

const rightArrowStyle = {
  position: "absolute",
  right: "40px",
};

const iconStyle = {
  width: "24px", // Adjust the icon size as needed
  height: "24px", // Adjust the icon size as needed
};

export default DocumentViewer;
