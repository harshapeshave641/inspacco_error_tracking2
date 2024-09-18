import { gql } from "@apollo/client";

export const GET_SERVICE_REQUEST_COMMENTS = gql`
  query getServiceRequestComments($serviceRequestId: ID!, $first: Int) {
    serviceRequest(id: $serviceRequestId) {
      id
      objectId
      comments(order: createdAt_DESC, first: $first) {
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
`;
