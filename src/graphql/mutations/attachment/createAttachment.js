import { gql } from '@apollo/client';

export const CREATE_ATTCHMENT = gql`
  mutation CreateAttachment(
    $fileName: String!
    $module: String = ""
    $name: String!
    $parentId: String!
    $permissionGroupId: String
    $status: String = "Active"
    $url: String!
  ) {
    createAttachment(
      input: {
        fields: {
          fileName: $fileName
          url: $url
          parentId: $parentId
          status: $status
          name: $name
          module: $module
          permissionGroupId: $permissionGroupId
        }
      }
    ) {
      attachment {
        fileName
        url
        objectId
      }
    }
  }
`;
