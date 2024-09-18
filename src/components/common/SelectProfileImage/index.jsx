import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import env from "../../../env";

const SelectProfileImage = ({
  onClick,
  url,
  showEdit = true,
  absoluteImageUrl,
}) => {
  return (
    <div className="inline-flex justify-center">
      <div className="relative inline-flex items-end group overflow-hidden ring ring-offset-base-100 ring-offset-2 rounded-full">
        {url ? (
          <img
            className="rounded-full h-24 w-24"
            src={
              absoluteImageUrl
                ? url
                : `${env.serverURL}/files/${env.appId}/${url}`
            }
          />
        ) : (
          <UserCircleIcon className="rounded-lg w-24 h-24" />
        )}
        {showEdit && (
          <div
            onClick={onClick}
            className="absolute invisible cursor-pointer group-hover:visible px-9 pb-4 top-[70px] bg-base-300 text-sm"
          >
            Edit
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectProfileImage;
