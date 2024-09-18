import moment from "moment";

import env from "../../../env";
import useColorTheme from "../../../hooks/useColorTheme";

import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

const Comment = ({
  children = "",
  commentor = "",
  date = new Date(),
  profilePic,
}) => {
  let { isDarkTheme } = useColorTheme();
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {profilePic ? (
            <img
              src={`${env.serverURL}/files/${env.appId}/${profilePic}`}
              // alt={image.name}
              className="w-full h-auto rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-10 h-10" />
          )}
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">
          {moment(date).format("hh:mm A, MMM DD, YYYY")}
        </time>
      </div>
      <div className="chat-bubble chat-bubble-primary">
        <span
          className="text-xs font-medium"
          style={{ color: isDarkTheme ? "white" : "darkgray" }}
        >
          {commentor}{" "}
        </span>
        <div>{children}</div>
      </div>
      {/* {commentor?<div className="chat-footer opacity-50">{commentor}</div>:null} */}
      {/* <div className="chat-footer opacity-50">Delivered</div> */}
    </div>
  );
};

export default Comment;
