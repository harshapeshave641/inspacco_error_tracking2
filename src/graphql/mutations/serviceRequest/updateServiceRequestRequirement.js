import { gql } from '@apollo/client';

export const UPDATE_SERVICE_REQUEST_REQ = gql`
  mutation updateServiceRequestReuirement(
    $serviceRequestId: ID!
    $requirement: String!
  ) {
    updateServiceRequest(
      input: { id: $serviceRequestId, fields: { requirement: $requirement } }
    ) {
      serviceRequest {
        objectId
        id
        requirement
      }
    }
  }
`;
