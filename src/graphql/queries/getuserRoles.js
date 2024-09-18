import { gql } from "@apollo/client";

export const GET_USER_ROLES = gql`
  query getUserRoles($user: ID) {
    roles(first:100000,where: { users: { have: { objectId: { equalTo: $user } } } }) {
      edges {
        node {
          name
          objectId
        }
      }
    }
  }
`;

export const GET_ROLES_BY_REGEX = gql`
query getUserRoles($term: String!) {
    roles(where: {name:{matchesRegex:$term}}) {
      edges {
        node {
          name
          objectId
        }
      }
    }
}
`