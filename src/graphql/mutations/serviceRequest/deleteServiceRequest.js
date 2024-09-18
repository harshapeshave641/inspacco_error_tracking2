import { gql } from '@apollo/client';

export const DELETE_SERVICE_REQUEST = gql`
  mutation DeleteServiceRequest($id: ID!) {
    deleteServiceRequest(input: { id: $id }) {
      serviceRequest {
        id
        objectId
      }
    }
  }
`;
