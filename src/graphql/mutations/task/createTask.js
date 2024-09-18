import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation createTask(
    $serviceSubscriptionId: ID!
    $summary: String!
    $description: String!
    $rewardPoints: Float!
    $frequency: String!
    $dayInWeek: Float
    $dayInMonth: Float
    $startDate: Date
    $endDate: Date
    $status: String! = "Active"
    $isVisible: Boolean
  ) {
    updateServiceSubscription(
      input: {
        id: $serviceSubscriptionId
        fields: {
          tasks: {
            createAndAdd: {
              summary: $summary
              description: $description
              rewardPoints: $rewardPoints
              frequency: $frequency
              dayInWeek: $dayInWeek
              dayInMonth: $dayInMonth
              startDate: $startDate
              endDate: $endDate
              status: $status
              isVisible: $isVisible
            }
          }
        }
      }
    ) {
      serviceSubscription {
        id
        objectId
        tasks {
          edges {
            node {
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
      }
    }
  }
`;
