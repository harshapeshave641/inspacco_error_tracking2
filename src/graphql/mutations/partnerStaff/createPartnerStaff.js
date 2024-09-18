import { gql } from '@apollo/client';

export const CREATE_PARTNER_STAFF = gql`
  mutation createPartnerStaffMutation(
    $partnerId: ID!
    $firstName: String!
    $lastName: String!
    $mobileNumber: String!
    $address: String
    $profileImage: String
  ) {
    createPartnerStaff(
      input: {
        fields: {
          partner: { link: $partnerId }
          firstName: $firstName
          lastName: $lastName
          mobileNumber: $mobileNumber
          address: $address
          status: "Active"
          profileImage: $profileImage
        }
      }
    ) {
      partnerStaff {
        id
        firstName
        lastName
        objectId
        profileImage
        partner {
          id
          name
        }
      }
    }
  }
`;
