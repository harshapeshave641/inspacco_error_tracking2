import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import XCircleMiniIcon from "@heroicons/react/20/solid/XCircleIcon";

import { _openNewTab, isImage } from "../../../../helpers/utils";
import DocumentViewer from "../DocumentViewer";

export default function DocumentItem(node) {
  console.log("ndoe url", node.url);
  return (
    <>
      {isImage(node.url) ? (
        <DocumentViewer />
      ) : (
        <div
          onClick={() => {
            if (node?.openUrl) {
              _openNewTab(node.url);
            }
          }}
          className="flex h-12 w-48 hover:bg-base-300 cursor-pointer transition-all duration-300 rounded-md bg-base-100 jusify-center items-center p-2"
        >
          <DocumentTextIcon className="w-8 h-8" />
          <div className="text-xs truncate text-ellipsis overflow-hidden text-left mx-2">
            <div className="font-medium">{node.fileName}</div>
            <div>{node.createdAt}</div>
          </div>
          {/* <div className="self-start w-2">
            <XCircleMiniIcon className="w-4 h-4" />
          </div> */}
        </div>
      )}
    </>
  );
}
