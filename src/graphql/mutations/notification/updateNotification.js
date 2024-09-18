import { gql } from "@apollo/client";

export const UPDATE_NOTIFICATION = gql`
  mutation updateNotification($notificationId: ID!, $isRead: Boolean) {
    updateNotification(
      input: { id: $notificationId, fields: { isRead: $isRead } }
    ) {
      notification {
        id
        objectId
        isRead
      }
    }
  }
`;
