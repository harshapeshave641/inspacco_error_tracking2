import React from "react";

import DocumentItem from "./../DocumentItem";
import EmptyData from "../../EmptyData";
import AttachmentItem from "../AttachmentItem";
import moment from "moment";
import env from "../../../../env";
// import env from "../../env";
let { serverURL, appId } = env
export default function AttachmentList({
  data = [],
  isAttachmentImage = false,
}) {
  // ${serverURL}/files/${appId}/${attachment.url}
  if (!data.length) return <EmptyData msg="There are no attachments." />;
  return data.map((obj, index) => {
    return isAttachmentImage ? (
      <AttachmentItem
        node={{
          key: obj.uploadedFile.data.createFile.fileInfo.name,
          title: obj.imageName,
          // fileName: file.uploadedFile.data.createFile.fileInfo.name
          url: `${serverURL}/files/${appId}/${obj.uploadedFile.data.createFile.fileInfo.name}`,
        }}
      />
    ) : (
      <DocumentItem
        key={obj?.node.objectId}
        title={obj?.node.name}
        fileName={`${obj?.node.fileName}_${++index}`}
        date={moment(obj?.node.updatedAt).format("MMMM Do YYYY")}
        url={obj?.node.url}
      />
    );
  });
}
