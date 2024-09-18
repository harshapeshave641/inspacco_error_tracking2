import { gql } from "@apollo/client";

export const GET_PARTNER_MEMBERS_BY_TYPE_QUERY = gql`
  query getPartnerMembers($partnerId: ID!, $type: [String] = "PARTNER_ADMIN") {
    partnerMembers(
      where: {
        partner: { have: { id: { equalTo: $partnerId } } }
        type: { in: $type }
      }
    ) {
      count
      edges {
        node {
          id
          objectId
          type
          subtype
          member {
            firstName
            lastName
            objectId
            id
            username
            mobileNumber
            profilePicture
          }
          partner {
            id
          }
        }
      }
    }
  }
`;