import { gql } from '@apollo/client';

export const DELETE_SCHEDULE_VISIT_COMMENT = gql`
  mutation deleteScheduleVisitComment($visitId: ID!, $commentId: [ID!]) {
    updateServiceSubscriptionSchedule(
      input: { id: $visitId, fields: { comments: { remove: $commentId } } }
    ) {
      serviceSubscriptionSchedule {
        id
        objectId
        comments {
          edges {
            node {
              id
              objectId
              comment
              createdAt
              createdBy {
                id
                objectId
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;
