import { gql } from "@apollo/client";

export const GET_NOTIFICATION_COUNT = gql`
  query notificationCount($userId: ID!, $createdAt: Date) {
    notificationCount: notifications(
      where: {
        user: { have: { objectId: { equalTo: $userId } } }
        isRead: { equalTo: false }
        createdAt: { greaterThanOrEqualTo: $createdAt }
      }
    ) {
      count
    }
  }
`;
