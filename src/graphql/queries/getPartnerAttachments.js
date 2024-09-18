import { gql } from "@apollo/client";

export const GET_PARTNER_ATTACHMENTS = gql`
  query getPartnerAttachment($partnerId: String!, $module: String) {
    attachments(
      where: {
        parentId: { equalTo: $partnerId }
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
        }
      }
    }
  }
`;
