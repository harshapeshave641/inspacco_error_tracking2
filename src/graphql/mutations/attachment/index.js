import { gql } from '@apollo/client';

export const DELETE_ATTACHMENT = gql`
  mutation deleteAttachment($id: ID!) {
    deleteAttachment(input: { id: $id }) {
      attachment {
        id
        objectId
      }
    }
  }
`;
