import React, { useState } from "react";
import TasksIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { toast } from "react-toastify";
import { GET_TASKACTIVITY_BY_ID } from "../../graphql/queries/getTasks";
import Details from "../../components/Details";

import {
  _getCorePropsFromNode,
  pickupDataFromResponse,
} from "../../helpers/utils";
import { ACTIONS } from "../../helpers/validations";
import {
  UPDATE_TASK_ACTIVITY_ATTACHMENT_BY_ID,
  UPDATE_TASK_ACTIVITY_BY_ID,
} from "../../graphql/mutations/task/updateTaskActivity";
import { useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
const fn = () => {};
export default function TaskActivityDetails({
  taskActivityId,
  source = "task",
  onChange = fn,
  serviceName,
}) {
  console.log("taskActivityId", taskActivityId);
  const [selectedTask, setSelectedTask] = useState({});
  let { user } = useSelector((state) => state.authSlice);
  const {
    loading,
    error,
    refetch,
    data: taskActivityRes,
  } = useQuery(GET_TASKACTIVITY_BY_ID, {
    variables: { id: taskActivityId },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      console.log("res", res);
      const obj = pickupDataFromResponse({ data: res });
      console.log("obj", obj);
      setSelectedTask({
        ...obj,
        serviceSubscription: {
          service: {
            name: serviceName,
          },
        },
      });
    },
  });
  const [updateTaskActivity] = useMutation(UPDATE_TASK_ACTIVITY_BY_ID);
  const [updateTaskActivityAttachment] = useMutation(
    UPDATE_TASK_ACTIVITY_ATTACHMENT_BY_ID
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("data", selectedTask);
  async function handleSubmit(data) {
    console.log("handleSubmit data", data);
    console.log("selectedTask", selectedTask);
    let payload = { id: selectedTask.objectId };
    let changeField = "";
    if (data.status !== selectedTask.taskStatus) {
      changeField = "Status";
      payload = {
        ...payload,
        taskStatus: data.status,
        action: ACTIONS.changeStatus,
        value: data.status,
        // status: data.status?.value,
        userId: user.objectId,
      };
    } else if (data.comment !== selectedTask.comment) {
      changeField = "Comment";
      payload = {
        ...payload,
        taskStatus: selectedTask.taskStatus,
        comment: data.comment,
        action: ACTIONS.editComment,
        value: data.comment,
        userId: user.objectId,
      };
    }
    //

    console.log("updatedValues", payload);
    await updateTaskActivity({ variables: payload });
    refetch();
    toast.success(`Task ${changeField} Updated successfully`);
    onChange();
  }
  async function handleAttachmentUpload(attachment) {
    if (!attachment) return;
    console.log("handleAttachmentUpload", attachment);
    const updatedValues = {
      id: selectedTask.objectId,
      attachments: Array.isArray(attachment) ? attachment : [attachment],
    };
    await updateTaskActivityAttachment({ variables: updatedValues });
    // await getServiceTasksBySociety();
    refetch();
    onChange();
    toast.success(`Task Attachment Uploaded successfully`);
  }
  console.log("selecctedTask", selectedTask);
  return (
    <div>
      <Details
        {...{
          selectedRecord: {
            ..._getCorePropsFromNode(selectedTask, source),
            ...selectedTask,
            status: selectedTask.taskStatus,
          },
          source,
          icon: <TasksIcon className="w-6 h-6 text-accent" />,
          loading: false,
          onSubmit: handleSubmit,
          onUploadDone: handleAttachmentUpload,
        }}
      />
    </div>
  );
}
