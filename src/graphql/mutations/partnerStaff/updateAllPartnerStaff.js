import { gql } from '@apollo/client';

export const UPDATE_ALL_PARTNER_STAFF = gql`
  mutation updatePartnerStaff($id: ID!, $isDeleted: Boolean) {
    updatePartnerStaff(input: { id: $id, fields: { isDeleted: $isDeleted } }) {
      partnerStaff {
        id
        objectId
        isDeleted
      }
    }
  }
`;
