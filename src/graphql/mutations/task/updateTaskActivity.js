import { gql } from "@apollo/client";

export const UPDATE_TASK_ACTIVITY_BY_ID = gql`
  mutation updateTaskActivityMutation(
    $id: ID!
    $comment: String
    $taskStatus: String
    $action: String
    $value: String
    $userId: ID
  ) {
    updateTaskActivity(
      input: {
        id: $id
        fields: {
          comment: $comment
          taskStatus: $taskStatus
          activityHistory: {
            createAndAdd: {
              action: $action
              value: $value
              createdBy: { link: $userId }
            }
          }
        }
      }
    ) {
      taskActivity {
        comment
        taskStatus
        id
        objectId
      }
    }
  }
`;

export const UPDATE_TASK_ACTIVITY_ATTACHMENT_BY_ID = gql`
  mutation updateTaskActivityMutation($id: ID!, $attachments: [ID!]) {
    updateTaskActivity(
      input: { id: $id, fields: { attachments: { add: $attachments } } }
    ) {
      taskActivity {
        comment
        taskStatus
        id
        objectId
      }
    }
  }
`;
