import { gql } from '@apollo/client';

export const DELETE_INCIDENT = gql`
  mutation DeleteIncident($id: ID!) {
    deleteIncident(input: { id: $id }) {
      incident {
        id
        objectId
      }
    }
  }
`;
