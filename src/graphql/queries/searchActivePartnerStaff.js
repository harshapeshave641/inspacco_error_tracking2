import { gql } from "@apollo/client";

export const SEARCH_ACTIVE_PARTNER_STAFFS = gql`
  query getPartnerStaff($partnerId: ID!, $q: String = "") {
    partnerStaffs(
      where: {
        partner: { have: { objectId: { equalTo: $partnerId } } }
        status: { equalTo: "Active" }
        isDeleted: { equalTo: false }
        OR: [
          { firstName: { matchesRegex: $q, options: "i" } }
          { lastName: { matchesRegex: $q, options: "i" } }
        ]
      }
      first: 50000
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
