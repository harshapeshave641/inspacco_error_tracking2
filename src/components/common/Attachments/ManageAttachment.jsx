import React, { useRef, useState } from "react";
import Modal from "../Modal";
import FileSelector from "../../fileSelector";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import Button from "../neomorphic/Button";

function ManageAttachment({
  parentId,
  module,
  permissionGroupId,
  onUploadDone,
}) {
  const photoManagerRef = useRef(null);
  let [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  const _handleAddAttachmentsToComplaint = async (photo) => {
    await photoManagerRef.current?.storeAttachment(
      parentId,
      photo.uploadedFile,
      module,
      permissionGroupId,
      photo.imageName
    );

    setShowImageSelectorModal(false);
    onUploadDone();
    // onUploadHandler(attachments);


    
  };
  return (
    <div>
      <div className="flex justify-between">
        <label className="pb-1 text-lg font-medium label-text text-accent"></label>
        <Button
          type="outline"
          onClick={() => setShowImageSelectorModal(!showImageSelectorModal)}
          className="rounded-xl btn-sm btn"
        >
          <div className="flex items-center justify-center gap-2">
            <PaperClipIcon className="w-4 h-4" />
            Upload
          </div>
        </Button>
      </div>
      <Modal
        title="Upload Files"
        closeModal={() => setShowImageSelectorModal(false)}
        showModal={showImageSelectorModal}
        fullscreen
        showBtns={false}
      >
        {showImageSelectorModal && (
          <FileSelector
            ref={photoManagerRef}
            module={module}
            parentId={parentId}
            permissionGroupId={permissionGroupId}
            onSaveAttachment={onUploadDone}
            onImageSelected={_handleAddAttachmentsToComplaint}
          />
        )}
      </Modal>
    </div>
  );
}

export default ManageAttachment;
