import { gql } from '@apollo/client';

export const SOFT_DELETE_PARTNER_STAFF = gql`
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

export const DELETE_PARTNER_STAFF = gql`
  mutation DeletePartnerStaff($id: ID!) {
    deletePartnerStaff(input: { id: $id }) {
      partnerStaff {
        id
        objectId
      }
    }
  }
`;