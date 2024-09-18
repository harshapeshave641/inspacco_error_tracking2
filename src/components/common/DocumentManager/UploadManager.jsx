import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import HoverIcon from "../HoverIcon";
import AttachmentList from "../Attachments/AttachmentList";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import FileSelector from "../../fileSelector";

export default function UploadManager({ ref, onUploadDone }) {
  let [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const handleDocumentUpload = (attachment) => {
    setShowImageSelectorModal(false);
    setAttachments((prvAttachs) => [...prvAttachs, attachment]);
  };
  useEffect(() => {
    onUploadDone(attachments);
  }, [attachments]);
  return (
    <div>
      <div className="form-control sm:w-full md:w-full lg:w-1/2 mx-6">
        <div className="form-control sm:w-full md:w-full lg:w-1/10">
          <div className="flex justify-between">
            <label className="label-text text-lg font-medium text-accent pb-1">
              Attachments
            </label>
            <HoverIcon
              onClick={() => setShowImageSelectorModal(!showImageSelectorModal)}
              icon={<PaperClipIcon className="w-4 h-4" />}
            />
          </div>
          <div className="pt-6 flex gap-2">
            <AttachmentList isAttachmentImage data={attachments} />
          </div>
        </div>
      </div>
      <Modal
        title="Upload Files"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        fullscreen
        showBtns={false}
      >
        <FileSelector
          ref={ref}
          parentId={null}
          onImageSelected={handleDocumentUpload}
        />
      </Modal>
    </div>
  );
}
