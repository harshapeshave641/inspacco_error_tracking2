import { gql } from '@apollo/client';

export const UPDATE_PARTNER_STAFF_BY_ID = gql`
  mutation updatePartnerStaffMutation(
    $id: ID!
    $firstName: String
    $lastName: String
    $mobileNumber: String
    $status: String
    $address: String
    $profileImage: String
  ) {
    updatePartnerStaff(
      input: {
        id: $id
        fields: {
          firstName: $firstName
          lastName: $lastName
          status: $status
          mobileNumber: $mobileNumber
          address: $address
          profileImage: $profileImage
        }
      }
    ) {
      partnerStaff {
        firstName
        lastName
        id
        objectId
        profileImage
      }
    }
  }
`;
