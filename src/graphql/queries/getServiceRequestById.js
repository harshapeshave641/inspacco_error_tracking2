import { gql } from "@apollo/client";

export const GET_SERVICE_REQUEST_DETAILS = gql`
  query getServiceRequest($id: ID!) {
    serviceRequest(id: $id) {
      id
      objectId
      status
      createdAt
      updatedAt
      requirement
      society {
        addressLine1
        addressLine2
        name
        area
        city
        pincode
      }
      service {
        name
        objectId
      }
      requester {
        firstName
        lastName
        mobileNumber
        objectId
      }
      visitDate
      visitRequirement
      referralCode
      quotations(order: displayId_DESC, first: 1) {
        edges {
          node {
            id
            objectId
            createdAt
            updatedAt
            discount
            tax
            otherCharges
            margin
            totalAmount
            note
            status
            displayId
            actualAmount
            items {
              edges {
                node {
                  id
                  objectId
                  serialNumber
                  rate
                  displayId
                  quantity
                  amount
                  comment
                  serviceDescription
                }
              }
            }
          }
        }
      }
    }
  }
`;
