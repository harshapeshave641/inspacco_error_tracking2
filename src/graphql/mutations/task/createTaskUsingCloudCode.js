import { gql } from "@apollo/client";

export const CREATE_TASK_USING_CLOUD_CODE = gql`
  mutation createTask($params: Object!) {
    callCloudCode(input: { functionName: createTask, params: $params }) {
      result
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $taskId: ID!
    $summary: String!
    $description: String!
    $rewardPoints: Float!
    $frequency: String!
    $dayInWeek: Float
    $dayInMonth: Float
    $status: String! = "Active"
    $isVisible: Boolean
    $assignedTo: ID
    $category:String
  ) {
    updateTask(
      input: {
        id: $taskId
        fields: {
          summary: $summary
          description: $description
          rewardPoints: $rewardPoints
          frequency: $frequency
          dayInWeek: $dayInWeek
          dayInMonth: $dayInMonth
          status: $status
          isVisible: $isVisible
          category:$category
          assignedTo: { link: $assignedTo }
        }
      }
    ) {
      task {
        id
        objectId
        summary
        description
        rewardPoints
        frequency
        dayInWeek
        dayInMonth
        status
        isVisible
      }
    }
  }
`;