import { gql } from "@apollo/client";

export const GET_SOCIETY_KAM = gql`
  query getSocietyKAM($societyId: ID!) {
    societyKAM: societyMembers(
      where: {
        AND: {
          type: { equalTo: "INSPACCO_KAM" }
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
