import { gql } from "@apollo/client";

export const GET_ATTACHMENTS = gql`
  query getAttachments($parentId: String!, $module: String) {
    attachments(
      where: {
        parentId: { equalTo: $parentId }
        module: { equalTo: $module }
        status: { equalTo: "Active" }
      }
    ) {
      edges {
        node {
          fileName
          id
          module
          name
          objectId
          parentId
          status
          url
          updatedAt
          createdAt
          createdBy {
            id
            objectId
          }
        }
      }
    }
  }
`;
