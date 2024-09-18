import { gql } from "@apollo/client";

export const GET_SOCIETY_MEMBERS = gql`
  query getSocietyMembers($societyId: ID, $types: [String]) {
    societyMembers(
      where: {
        AND: {
          type: { in: $types }
          society: { have: { objectId: { equalTo: $societyId } } }
        }
      }
    ) {
      edges {
        node {
          id
          objectId
          type
          subtype
          member {
            ... on User {
              firstName
              lastName
              objectId
              id
              username
              mobileNumber
            }
          }
        }
      }
    }
  }
`;
