import { gql } from '@apollo/client';

export const ADD_SCHEDULE_VISIT_COMMENT = gql`
  mutation ServiceSubscriptionSchedule($visitId: ID!, $comment: String!) {
    updateServiceSubscriptionSchedule(
      input: {
        id: $visitId
        fields: { comments: { createAndAdd: { comment: $comment } } }
      }
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
