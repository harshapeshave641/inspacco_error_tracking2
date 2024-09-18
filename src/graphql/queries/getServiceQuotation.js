import { gql } from "@apollo/client";

export const GET_SERVICE_QUOTATION = gql`
  query getServiceQuotation($id: ID!, $quotationId: ID!) {
    serviceRequest(id: $id) {
      quotations(where: { objectId: { equalTo: $quotationId } }) {
        edges {
          node {
            createdAt
            discount
            displayId
            id
            note
            objectId
            status
            otherCharges
            tax
            updatedAt
            actualAmount
            totalAmount
            items(order: serialNumber_ASC) {
              edges {
                node {
                  amount
                  comment
                  createdAt
                  displayId
                  id
                  objectId
                  quantity
                  rate
                  serialNumber
                  serviceDescription
                  updatedAt
                }
              }
            }
          }
        }
      }
      objectId
      service {
        name
        id
        objectId
      }
    }
  }
`;
