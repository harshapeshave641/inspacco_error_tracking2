import { gql } from "@apollo/client";

export const GET_TASKS_BY_SOCIETY = gql`
  query getSocietyTasks($serviceSubscriptionIds: [String], $startDate: Date!, $endDate: Date!) {
    taskActivities(
      first:1000000,
      where: {
        taskDate: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        task : {
          have : { module: {equalTo:"ServiceSubscription"},parentId:{in:$serviceSubscriptionIds}}
        }
        
      }
    ) {
      edges {
        node {
          id
          objectId
          taskDate
          taskStatus
          createdAt
          updatedAt
          task {
            description
            parentTask {
              objectId
            }
          }
          attachments {
            edges {
              node {
                parentId
              }
            }
          }
          createdBy {
            firstName
            lastName
            mobileNumber
          }
        }
      }
    }
  }
`;
