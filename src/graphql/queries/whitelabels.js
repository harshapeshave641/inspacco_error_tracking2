import { gql } from "@apollo/client";
export const GET_WHILTE_LABELS = gql`
  query getWhiteLabels {
    whiteLabels(first: 100) {
      edges {
        node {
          objectId
          label
          value
        }
      }
    }
  }
`;
