import { gql } from "@apollo/client";

export const GET_SOCIETY_LEVEL_INCIDENTS_FOR_DASHBOARD = gql`
  query getSocietyLevelIncidentsForDashboard(
    $societyId: ID!
    $status: [String]
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
    $serviceSubscriptionIds:[ID]!
  ) {
    incidents(
      where: {
        serviceSubscription: {
          have: { objectId: { in: $serviceSubscriptionIds }, society: { have: { objectId: { equalTo: $societyId } } } }
        }
        createdAt: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        status: { in: $status }
      }
      first: $recordCount
      order: updatedAt_DESC
    ) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          category
          priority
          summary
          description
          status
          assignedGroup
          displayId
        }
      }
    }
  }
`;
