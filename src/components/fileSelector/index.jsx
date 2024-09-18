import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import moment from "moment";

import CameraIcon from "@heroicons/react/24/solid/CameraIcon";
import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import ArrowUpTrayIcon from "@heroicons/react/24/solid/ArrowUpTrayIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import CameraView from "../common/CameraView";
import Modal from "../common/Modal";
import Button from "../common/neomorphic/Button";

import { UPLOAD_FILE } from "../../graphql/mutations/attachment/uploadFile";
import { CREATE_INCIDENT } from "../../graphql/mutations/incident/createIncident";
import { GET_ATTACHMENTS } from "../../graphql/queries/getAttachments";
import { CREATE_ATTCHMENT } from "../../graphql/mutations/attachment/createAttachment";
import HoverIcon from "../common/HoverIcon";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import EmptyData from "../common/EmptyData";
import { formatFileSize } from "../../helpers/utils";

const FileSelector = (
  {
    parentId,
    uploadedFile,
    module,
    permissionGroupId,
    fileName,
    onImageSelected,
    isUploadOpen,
    disableUpload = false,
    onSaveAttachment = (objectId) => null,
  },
  ref
) => {
  console.log("ref", ref);
  let [selectedFiles, setSelectedFiles] = useState(null);
  let [showCamera, setShowCamera] = useState(false);

  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [saveAttachment, { loading: creatingAttachment }] =
    useMutation(CREATE_ATTCHMENT);
  console.log("module", module);
  console.log("module", parentId);

  useEffect(() => {
    setSelectedFiles([]);
  }, [parentId]);

  const onUploadHandler = async (file, file_name) => {
    console.log("file", file);
    console.log("file_name", file_name);
    console.log("parent id", parentId);
    const uploadedFile = await uploadFile({ variables: { file } });
    if (uploadedFile.data?.errors) {
      toast.error(`File upload failed.`);
      return;
    }
    //const fileName = `${moment().valueOf()}.${file.type.split("/")[1]}`;
    const fileName = file_name;
    if (parentId) {
      const res = await onAttachmentDataSave(
        parentId,
        uploadedFile,
        module,
        permissionGroupId,
        fileName
      );

      // setShowUpload(false);
      // bottomSheetStatus(false);
      // refetch();
    } else {
      console.log("image selected");
      onImageSelected({ uploadedFile, imageName: fileName });
      // setShowUpload(false);
      // bottomSheetStatus(false);
    }
    setSelectedFiles(null);
    toast.success(`${file_name} Uploded successfully!`);
  };

  const onAttachmentDataSave = async (
    parentId,
    uploadedFile,
    attachmentModule,
    permissionGroupId,
    fileName
  ) => {
    const attachmentData = {
      fileName,
      url: uploadedFile.data.createFile.fileInfo.name,
      parentId,
      status: "Active",
      name: fileName,
      module: attachmentModule, // 'Service_Task_Photos',
      permissionGroupId, // `SOCIETY_${societyId}`,
    };
    const save = await saveAttachment({ variables: attachmentData });
    // console.log("AFTER FILE UPLOAD DATA", save?.data?.createAttachment?.attachment?.objectId);
    onSaveAttachment(save?.data?.createAttachment?.attachment?.objectId);
    if (save?.data?.error) return false;
    else return true;
  };

  // start image selector functionality
  const onCamera = async () => {
    setShowCamera(true);
  };

  const onCameraClose = async (file) => {
    console.log("file after camera", file);
    setShowCamera(false);
    if (file) setSelectedFiles(file);
  };
  // end image selector functionality

  const blob2file = (blobData) => {
    const fd = new FormData();
    fd.set("image", blobData);
    return fd.get("image");
  };

  const _handleAddAttachment = async () => {
    console.log("selectedFiles", selectedFiles);
    if (!selectedFiles) {
      toast.info("Please attach photo.");
      return;
    }
    // setIsUploading(true);
    const files = selectedFiles.map((file) => URL.createObjectURL(file));
    let i = 0;

    for (const selectedFile of files) {
      try {
        const res = await fetch(selectedFile);
        const blob = await res.blob();
        const file = await blob2file(blob);
        await onUploadHandler(file, selectedFiles[i].name);
      } catch (e) {
        toast.error(
          `Something went wrong while uploading ${selectedFiles[i].name} `
        );
      } finally {
        i++;
      }
    }
  };

  useImperativeHandle(ref, () => ({
    // each key is connected to `ref` as a method name
    // they can execute code directly, or call a local method
    storeAttachment: (
      parentId,
      uploadedFile,
      module,
      permissionGroupId,
      fileName
    ) => {
      onAttachmentDataSave(
        parentId,
        uploadedFile,
        module,
        permissionGroupId,
        fileName
      );
    },
    refresh: () => {},
  }));

  const removeFile = (fileToRemove) => {
    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    // setFiles(updatedFiles)
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="pt-4 flex justify-around">
      <div className="flex justify-center text-center py-4">
        {selectedFiles?.length ? (
          <div className="">
            {selectedFiles.map((file, index) => (
              <div style={{ textAlign: "left" }}>
                {index + 1}{" "}
                <kbd className="kbd m-2">
                  {file.name} &nbsp;{formatFileSize(file.size)}
                </kbd>{" "}
                <XCircleIcon
                  className="h-5 w-5 text-red-500 inline cursor-pointer"
                  onClick={(e) => removeFile(file)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyData msg="No Files Selected" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-6 items-center justify-center pb-4">
          {/* <div className="text-center" onClick={onCamera}>
            <div className="p-12 bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer rounded-lg">
              <CameraIcon className="w-8 h-8" />
            </div>
            <label>Camera</label>
          </div> */}
          <div className="text-center">
            <label htmlFor="imagepicker">
              <div className="p-12 bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer rounded-lg">
                {/* <PhotoIcon className="w-8 h-8" /> */}
                <HoverIcon icon={<PaperClipIcon className="w-4 h-4" />} />
              </div>
              <label>Upload</label>
              <div>
                <div className="badge badge-ghost">Max Size: 20 MB</div>
              </div>
            </label>
            <input
              id="imagepicker"
              type="file"
              multiple
              maxSize="20MB"
              className="invisible h-0 w-0"
              // accept=".svg, .png, .jpg, .png"
              onChange={({ target }) => {
                console.log("fiels", target.files);
                if (target.files instanceof FileList) {
                }
                setSelectedFiles(Array.from(target.files));
              }}
            />
          </div>
        </div>
        {selectedFiles?.length ? (
          <div className="inline-flex pt-4 gap-2 justify-center">
            <Button
              type="accent"
              loading={creatingAttachment}
              onClick={_handleAddAttachment}
              className="rounded-full gap-2"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Upload
            </Button>
          </div>
        ) : null}
      </div>
      {showCamera && (
        <Modal
          fullscreen
          showModal={showCamera}
          title="Capture Photo"
          closeModal={() => setShowCamera(false)}
          showBtns={false}
        >
          <CameraView onSnapTaken={onCameraClose} />
        </Modal>
      )}
    </div>
  );
};

export default forwardRef(FileSelector);
