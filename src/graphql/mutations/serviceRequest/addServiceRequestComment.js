import { gql } from '@apollo/client';

export const ADD_SERVICE_REQUEST_COMMENT = gql`
  mutation addServiceRequestComment(
    $serviceRequestId: ID!
    $userId: ID!
    $comment: String!
  ) {
    updateServiceRequest(
      input: {
        id: $serviceRequestId
        fields: {
          comments: {
            createAndAdd: { comment: $comment, createdBy: { link: $userId } }
          }
        }
      }
    ) {
      serviceRequest {
        id
        objectId
        updatedAt
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
