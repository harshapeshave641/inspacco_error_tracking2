import { gql } from "@apollo/client";

export const GET_LOOKUPS = gql`
  query getLookups($lookuptype: String, $societyId: String) {
    lookups(
      where: {
        parentId: { equalTo: $societyId }
        type: { equalTo: $lookuptype }
      }
    ) {
      edges {
        node {
          id
          objectId
          value
          type
          parentId
        }
      }
    }
  }
`;
