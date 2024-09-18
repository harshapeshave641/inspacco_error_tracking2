import { gql } from "@apollo/client";

export const SEARCH_USER_BY_MOBILENO_OR_NAME = gql`
 query searchUsers($term: String!) {
  users(where: {OR: [
    {mobileNumber: {matchesRegex: $term, options: "i"}},
    {firstName: {matchesRegex: $term, options: "i"}},
    {lastName: {matchesRegex: $term, options: "i"}}
  ]}) {
    edges {
      node {
        firstName
        lastName
        objectId
        id
        mobileNumber
      }
    }
  }
}
`;
