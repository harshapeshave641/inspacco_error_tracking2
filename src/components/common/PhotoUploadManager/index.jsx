import { useEffect, useState, useImperativeHandle } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";

import { UPLOAD_FILE } from "../../graphql/mutations/attachment/uploadFile";
import { CREATE_ATTCHMENT } from "../../graphql/mutations/attachment/createAttachment";
import { GET_ATTACHMENTS } from "../../graphql/queries/getAttachments";
import View from "../View";

const PhotoUploadManager = ({
  parentId,
  permissionGroupId,
  module,
  isUploadOpen,
  style,
  title = "Photos",
  disableUpload = false,
  onUploadedFile,
  onSaveAttachment,
  ref,
}) => {
  let [selectedPic, setSelectedPic] = useState(null);

  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [saveAttachment] = useMutation(CREATE_ATTCHMENT);
  const [getAttachmentQuery, { data, loading, refetch }] = useLazyQuery(
    GET_ATTACHMENTS,
    {
      variables: {
        parentId,
        module, // 'Service_Task_Photos',
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (parentId) {
      getAttachmentQuery();
    }
  }, []);

  useEffect(() => {
    return () => setSelectedPic(null);
  }, []);

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
    refresh: refetch,
  }));

  const onAttachmentDataSave = async (
    parentId,
    uploadedFile,
    module,
    permissionGroupId,
    fileName
  ) => {
    const attachmentData = {
      fileName,
      url: uploadedFile.data.createFile.fileInfo.name,
      parentId,
      status: "Active",
      name: fileName,
      module, // 'Service_Task_Photos',
      permissionGroupId, // `SOCIETY_${societyId}`,
    };
    const save = await saveAttachment({ variables: attachmentData });
    // console.log("AFTER FILE UPLOAD DATA", save?.data?.createAttachment?.attachment?.objectId);
    onSaveAttachment(save?.data?.createAttachment?.attachment?.objectId);
    if (save?.data?.error) {
      // setShowUpload(false);
      // bottomSheetStatus(false);
      return false;
    } else {
      return true;
    }
  };

  const onUploadHandler = async (file, result) => {
    // setShowUpload(true);
    // bottomSheetStatus(true);
    const uploadedFile = await uploadFile({ variables: { file } });
    if (uploadedFile.data?.errors) {
      // bottomSheetStatus(false);
      // setShowUpload(false);
      toast.error(`Image upload failed.`);
      return;
    }
    const imageName = `${moment().valueOf()}.${file.type.split("/")[1]}`;
    if (parentId) {
      const res = await onAttachmentDataSave(
        parentId,
        uploadedFile,
        module,
        permissionGroupId,
        imageName
      );

      // setShowUpload(false);
      // bottomSheetStatus(false);
      toast.success(`Photo uploded successfully.`);
      refetch();
    } else {
      onUploadedFile({ uploadedFile, imageName });
      // setShowUpload(false);
      // bottomSheetStatus(false);
    }
  };

  const onUploadCancel = () => {
    // setShowUpload(false);
    // bottomSheetStatus(false);
  };

  if (!data?.attachments?.edges.length && disableUpload) {
    return null;
  }

  const convertDateToISTFormat = (date) => {
    return moment.utc(date).local().format("DD MMM YYYY h:mm A");
  };

  return (
    <div className="pt-4">
      {/* <View className="flex flex-start flex-row">
        {data?.attachments?.edges.map(({ node }) => {
          return (
            <ImageListItem
              key={node.objectId}
              title={node.name}
              fileName={node.fileName}
              description={moment(node.updatedAt).format("MMMM Do YYYY")}
              url={node.url}
              updatedAt={convertDateToISTFormat(node.updatedAt)}
            />
          );
        })}
      </View> */}
    </div>
  );
};

export default ImageSelector;
