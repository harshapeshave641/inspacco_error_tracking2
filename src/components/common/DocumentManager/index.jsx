import React, { forwardRef, useEffect } from "react";
import ManageAttachment from "../Attachments/ManageAttachment";
import DocumentViewer from "../Attachments/DocumentViewer";

import { GET_ATTACHMENTS } from "../../../graphql/queries/getAttachments";
import { useQuery } from "@apollo/client";
import { isFunction } from "lodash";

function DocumentManager({
  module,
  parentId,
  permissionGroupId,
  onUploadDone = null,
  getAttachments = null,
}) {
  const { data, loading, refetch } = useQuery(GET_ATTACHMENTS, {
    variables: {
      parentId,
      module, // 'Service_Task_Photos',
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (isFunction(getAttachments)) getAttachments(data?.attachments?.edges);
    },
  });

  return (
    <>
      <ManageAttachment
        {...{
          module,
          parentId,
          permissionGroupId,
          onUploadDone: () => {
            refetch();
            if (onUploadDone) {
              // if(isFunction(getAttachments)){
              //   getAttachments(data?.attachments?.edges?.length);
              // }
              onUploadDone();
            }
          },
        }}
      />
      <DocumentViewer
        // loading={loading}
        onChange={refetch}
        attachments={data?.attachments?.edges?.map((att) => att.node)}
      />
    </>
  );
}

export default DocumentManager;
