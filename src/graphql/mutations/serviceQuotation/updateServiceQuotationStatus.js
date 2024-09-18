import { gql } from "@apollo/client";

export const UPDATE_SERVICE_QUOTATION_STATUS_BY_ID = gql`
  mutation updateServiceQuotationStatusMutation(
    $id: ID!
    $note: String
    $status: String!
  ) {
    updateServiceQuotation(
      input: { id: $id, fields: { status: $status, note: $note } }
    ) {
      serviceQuotation {
        status
        note
        id
        objectId
      }
    }
  }
`;

export const UPDATE_SERVICE_QUOTATION_PARTNER_BY_ID = gql`
  mutation updateServiceQuotationStatusMutation($id: ID!, $partner: ID!) {
    updateServiceQuotation(
      input: { id: $id, fields: { partner: { link: $partner } } }
    ) {
      serviceQuotation {
        status
        partner {
          name
          objectId
        }
        id
        objectId
      }
    }
  }
`;

export const DELETE_SERVICE_QUOTATION = gql`
  mutation deleteQuotation($id: ID!) {
    deleteServiceQuotation(input: { id: $id }) {
      serviceQuotation {
        id
        objectId
      }
    }
  }
`;
