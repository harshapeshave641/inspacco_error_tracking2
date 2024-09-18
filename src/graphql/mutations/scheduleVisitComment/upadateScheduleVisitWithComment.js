import { gql } from '@apollo/client';

export const UPDATE_SCHEDULE_VISIT_COMMENTS = gql`
  mutation updateScheduleVisitComment($visitId: ID!, $commentIds: [ID!]!) {
    updateServiceSubscriptionSchedule(
      input: { id: $visitId, fields: { comments: { add: $commentIds } } }
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
