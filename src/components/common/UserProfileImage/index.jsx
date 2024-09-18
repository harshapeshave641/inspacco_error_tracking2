import env from "../../../env";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

export default function UserProfileImage({
  url,
  className = "w-12 h-12 rounded-lg",
}) {
  const _getAbsUrl = (url) =>
    url.includes("http") ? url : `${env.serverURL}/files/${env.appId}/${url}`;

  return url ? (
    <img
      src={_getAbsUrl(url)}
      className={`${className} ring ring-offset-base-100 ring-offset-2`}
    />
  ) : (
    <UserCircleIcon className={`${className}`} />
  );
}
