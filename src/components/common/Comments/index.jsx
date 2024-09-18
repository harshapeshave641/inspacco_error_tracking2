import React from "react";

import Comment from "../Comment";
import ReactiveInput from "../neomorphic/ReactiveInput";
import EmptyData from "../EmptyData";
import _ from "lodash";
import ChatBubbleLeftRightText from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import { useSelector } from "react-redux";

const Comments = ({
  comments = [],
  edit = false,
  onSubmit,
  loading = false,
}) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <div className="mt-4 ">
      <div>
        {comments.length ? (
          _.sortBy(comments, ["node.createdAt"]).map(({ node }) => (
            <div className={`flex ${user?.objectId === node?.createdBy?.objectId?'justify-end':'justify-start'}`}>
              <Comment
                profilePic={node?.createdBy?.profilePicture}
                date={node.createdAt}
                commentor={
                  node?.createdBy
                    ? `${node?.createdBy?.firstName} ${node?.createdBy?.lastName}`
                    : ""
                }
              >
                {node.comment}
              </Comment>
            </div>
          ))
        ) : (
          <EmptyData
            icon={<ChatBubbleLeftRightText className="w-6 h-6" />}
            msg="There are no comments."
          />
        )}
      </div>
      <div className="mt-4">
        <ReactiveInput value="" onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default Comments;
