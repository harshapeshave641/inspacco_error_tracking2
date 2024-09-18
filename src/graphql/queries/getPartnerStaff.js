import { gql } from "@apollo/client";

export const GET_PARTNER_STAFF_BY_ID = gql`
  query getPartnerStaff($id: ID!) {
    partnerStaff(id: $id) {
      address
      firstName
      id
      lastName
      mobileNumber
      profileImage
      objectId
      status
      isDeleted
      partner {
        objectId
        id
      }
    }
  }
`;
