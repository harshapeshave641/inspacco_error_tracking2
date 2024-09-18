import { gql } from "@apollo/client";

export const CREATE_SERVICE_QUOTATION = gql`
  mutation addServiceQuotation(
    $id: ID!
    $actualAmount: Float!
    $totalAmount: Float!
    $tax: Float!
    $otherCharges: Float!
    $discount: Float!
    $note: String = ""
    $quotationReceiverName: String = ""
    $createAndAdd: [CreateServiceQuotationItemFieldsInput!]
    $partner: ID!
  ) {
    updateServiceRequest(
      input: {
        id: $id
        fields: {
          quotations: {
            createAndAdd: {
              actualAmount: $actualAmount
              totalAmount: $totalAmount
              tax: $tax
              discount: $discount
              otherCharges: $otherCharges
              note: $note
              quotationReceiverName: $quotationReceiverName
              partner: { link: $partner }
              items: { createAndAdd: $createAndAdd }
            }
          }
        }
      }
    ) {
      serviceRequest {
        id
        objectId
        displayId
      }
    }
  }
`;
