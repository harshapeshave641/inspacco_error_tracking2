import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS_FOR_USER = gql`
  query getNotifications($userId: ID!, $first: Int!, $after: String) {
    notifications(
      first: $first
      after: $after
      where: { user: { have: { objectId: { equalTo: $userId } } } }
      order: createdAt_DESC
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          isRead
          message
          user {
            objectId
            firstName
            lastName
          }
          title
          updatedAt
          createdAt
          category
          data
        }
      }
    }
  }
`;
