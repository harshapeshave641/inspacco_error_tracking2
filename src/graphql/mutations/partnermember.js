import { gql } from "@apollo/client";

export const ADD_PARTNER_MEMBER = gql`
  mutation createPartnerMember(
    $partnerId: ID!
    $userId: ID!
    $type: String!
    $subtype: String
  ) {
    createPartnerMember(
      input: {
        fields: {
          type: $type
          subtype: $subtype
          partner: { link: $partnerId }
          member: { link: $userId }
        }
      }
    ) {
      partnerMember {
        id
        objectId
      }
    }
  }
`;

export const DELETE_PARTNER_MEMBER = gql`
  mutation deletePartnerMember($id: ID!) {
    deletePartnerMember(input: { id: $id }) {
      partnerMember {
        id
        objectId
      }
    }
  }
`;
