import { gql } from '@apollo/client';

export const UPDATE_ATTACHMENTS_STATUS = gql`
  mutation UpdateAttachmanetStatus($id: ID!, $status: String = "Inactive") {
    updateAttachment(input: { id: $id, fields: { status: $status } }) {
      attachment {
        fileName
        id
        module
        name
        objectId
        parentId
        status
        updatedAt
        url
      }
    }
  }
`;
