import { gql } from "@apollo/client";

export const UPDATE_SERVICE_REQUEST = gql`
  mutation updateServiceRequest(
    $ID: ID!
    $fields: UpdateServiceRequestFieldsInput
  ) {
    updateServiceRequest(input: { id: $ID, fields: $fields }) {
      serviceRequest {
        id
        objectId
        updatedAt
        resolutionComment
        visitDate
        status
        priority
        partner {
          objectId
          name
        }
        quotations(
          where: { status: { in: ["ACCEPTED", "REJECTED", "OPEN"] } }
          order: displayId_DESC
        ) {
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
              quotationReceiverName
              partner {
                objectId
                name
              }
              items {
                edges {
                  node {
                    id
                    objectId
                    serialNumber
                    rate
                    displayId
                    quantity
                    unit
                    amount
                    comment
                    serviceDescription
                    partnerRate
                    itemType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const UPDATE_SERVICE_REQUEST_STATUS_BY_ID = gql`
  mutation updateServiceRequestStatusMutation($id: ID!, $status: String!) {
    updateServiceRequest(input: { id: $id, fields: { status: $status } }) {
      serviceRequest {
        status
        id
        objectId
      }
    }
  }
`;

export const UPDATE_SERVICE_REQUEST_PRIORITY_BY_ID = gql`
  mutation updateServiceRequestStatusMutation($id: ID!, $priority: String!) {
    updateServiceRequest(input: { id: $id, fields: { priority: $priority } }) {
      serviceRequest {
        priority
        id
        objectId
      }
    }
  }
`;

export const UPDATE_SERVICE_REQUEST_RESOLUTION_COMMENT = gql`
  mutation updateServiceRequestStatusMutation(
    $id: ID!
    $resolutionComment: String!
  ) {
    updateServiceRequest(
      input: { id: $id, fields: { resolutionComment: $resolutionComment } }
    ) {
      serviceRequest {
        resolutionComment
        id
        objectId
      }
    }
  }
`;

export const UPDATE_SERVICE_REQUEST_VISIT_DATE = gql`
  mutation updateServiceRequestVisitDateMutation($id: ID!, $visitDate: Date!) {
    updateServiceRequest(
      input: { id: $id, fields: { visitDate: $visitDate } }
    ) {
      serviceRequest {
        visitDate
        id
        objectId
      }
    }
  }
`;
