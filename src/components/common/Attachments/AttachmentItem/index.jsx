import XCircleMiniIcon from "@heroicons/react/20/solid/XCircleIcon";

import UserProfileImage from "../../UserProfileImage";
import { _openNewTab } from "../../../../helpers/utils";

export default function AttachmentItem({
  node,
  removeAttachmentItem,
  removable = false,
}) {
  return (
    <div
      onClick={() => _openNewTab(node.url)}
      className="flex max-w-32 relative cursor-pointer transition-all duration-300 rounded-md bg-base-100 jusify-center items-center pb-2"
    >
      <div className="inline-flex flex-col">
        <div className="ml-2 mr-3">
          <UserProfileImage url={node.url} />
        </div>
        <div className="font-medium text-sm">{node.fileName}</div>
      </div>
      <div className="self-start w-2">
        <div className="">
          {removable && (
            <XCircleMiniIcon
              onClick={() => removeAttachmentItem(node)}
              className="absolute right-16 -top-2 w-4 h-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
