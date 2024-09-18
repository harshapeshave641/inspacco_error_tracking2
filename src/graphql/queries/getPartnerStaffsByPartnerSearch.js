import { gql } from "@apollo/client";

export const GET_PARTNER_STAFFS_SEARCH = gql`
  query getPartnerStaff($partnerId: ID!, $term: String = "") {
    partnerStaffs(
      where: {
        partner: { have: { objectId: { equalTo: $partnerId } } }
        isDeleted: { equalTo: false }
        OR: [
          { firstName: { matchesRegex: $term, options: "i" } }
          { lastName: { matchesRegex: $term, options: "i" } }
        ]
      }
      first: 5000
    ) {
      count
      edges {
        node {
          id
          firstName
          lastName
          mobileNumber
          objectId
          status
          profileImage
          isDeleted
          address
          user {
           firstName,
           lastName
           profilePicture
           mobileNumber
          }
          partner {
            objectId
            id
            name
          }
        }
      }
    }
  }
`;
