import { gql } from "@apollo/client";

export function getServiceRequestsSubQuery(filterObject) {
  const { status, startDate, endDate, client } = filterObject;
  console.log("status ----------------", status);
  return {
    ...{
      ...(status && { status: { in: status } }),
      ...(startDate && { createdAt: { greaterThanOrEqualTo: startDate } }),
      ...(endDate && { updatedAt: { lessThanOrEqualTo: endDate } }),
      ...(client && { society: { in: client } }),
    },
  };
}

export const GET_TOTAL_SR_COUNT = gql`
  query totalServiceRequests($subQuery: ServiceRequestWhereInput = {}) {
    serviceRequests(where: $subQuery) {
      count
    }
  }
`;

export const GET_ALL_SERVICE_REQUESTS_BY_ADMIN_FILTERS = gql`
  query getAllServiceRequestsBySubquery(
    $subQuery: ServiceRequestWhereInput = {}
    $limit: Int
    $skip: Int
  ) {
    serviceRequests(
      where: $subQuery
      order: createdAt_DESC
      first: $limit
      skip: $skip
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          status
          priority
          updatedAt
          createdAt
          displayId
          resolutionComment
          service {
            name
            objectId
          }
          activityHistory {
            edges {
              node {
                createdBy {
                  firstName
                  lastName
                  profilePicture
                  objectId
                }
                createdAt
                action
                value
                updatedAt
              }
            }
          }
          subService
          requirement
          visitDate
          visitRequirement
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
                      isContractual
                      partnerRate
                      itemType
                    }
                  }
                }
              }
            }
          }
          comments {
            edges {
              node {
                id
                objectId
                comment
                createdAt
                createdBy {
                  id
                  objectId
                  firstName
                  lastName
                }
              }
            }
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
            logo
            addressLine1
            addressLine2
            pincode
            city
            area
            state
            email
            settings
            GSTState
            GSTNo
            POCMobileNumber
            POCName
            POCEmail
            clientPhoneNumber
            CINNumber
            registeredEntityName
          }
          partner {
            objectId
            name
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

export const GET_RECENT_SERVICE_REQUESTS_FOR_SOCIETY = gql`
  query recentServiceRequestsForSociety($societyId: ID!, $recordCount: Int) {
    serviceRequests(
      order: updatedAt_DESC
      where: { society: { have: { objectId: { equalTo: $societyId } } } }
      first: $recordCount
    ) {
      edges {
        node {
          id
          objectId
          status
          createdAt
          updatedAt
          displayId
          resolutionComment
          service {
            name
            objectId
          }
          requester {
            objectId
            firstName
            lastName
            mobileNumber
          }
          society {
            name
          }
          visitDate
          visitRequirement
        }
      }
    }
  }
`;

export const GET_ALL_SERVICE_REQUESTS = gql`
  query serviceRequests($first: Int, $after: String) {
    serviceRequests(first: $first, after: $after, order: updatedAt_DESC) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          status
          updatedAt
          createdAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

// // AND: [
//   { updatedAt: { greaterThanOrEqualTo: $startDate } }
//   { updatedAt: { lessThanOrEqualTo: $endDate } }
// ]
export const GET_ALL_SERVICE_REQUESTS_BY_DATE = gql`
  query FilterServiceRequests($status: [String]) {
    serviceRequests(
      where: { OR: [{ status: { in: $status } }] }
      order: updatedAt_DESC
      first: 300
    ) {
      edges {
        node {
          id
          objectId
          status
          createdAt
          updatedAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

export const GET_SERVICE_REQUESTS_BY_DATERANGE = gql`
  query serviceRequests($startDate: Date, $endDate: Date, $societyId: ID!) {
    serviceRequests(
      where: {
        AND: [
          { createdAt: { greaterThanOrEqualTo: $startDate } }
          { updatedAt: { lessThanOrEqualTo: $endDate } }
          { society: { have: { objectId: { equalTo: $societyId } } } }
        ]
      }
      order: createdAt_DESC
      first: 3000
    ) {
      edges {
        node {
          id
          objectId
          status
          createdAt
          updatedAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
            addressLine1
            addressLine2
            pincode
            city
            area
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

// {displayId:{equalTo: $displayId}}
// {requester:{have:{firstName:{equalTo: $requesterName}}}}
// {society:{have:{name:{equalTo: $societyName}}}}
// , $displayId: Float, $requesterName: String, $societyName: String
export const GET_SERVICE_REQUEST_ACTIVITY_HISTORY = gql`
  query getServiceRequestActivityHistory($id: ID!) {
    serviceRequest(id: $id) {
      objectId
      createdAt
      status
      priority
      visitDate
      activityHistory {
        edges {
          node {
            createdBy {
              firstName
              lastName
              profilePicture
              objectId
            }
            createdAt
            action
            value
            updatedAt
          }
        }
      }
    }
  }
`;
export const GET_ALL_SERVICE_REQUESTS_NAME = gql`
  query serviceRequests(
    $serviceName: String
    $first: Int!
    $after: String
    $displayId: Float
    $requesterName: String
    $societyName: String
  ) {
    serviceRequests(
      where: {
        OR: [
          {
            service: {
              have: { name: { matchesRegex: $serviceName, options: "i" } }
            }
          }
          { displayId: { equalTo: $displayId } }
          {
            requester: {
              have: {
                firstName: { matchesRegex: $requesterName, options: "i" }
              }
            }
          }
          {
            society: {
              have: { name: { matchesRegex: $societyName, options: "i" } }
            }
          }
        ]
      }
      order: updatedAt_DESC
      first: $first
      after: $after
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          status
          createdAt
          updatedAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

export const GET_ALL_SOCIETY_SERVICE_REQUESTS_BY_DATE = gql`
  query serviceRequestsByFilterSos(
    $status: [String]
    $societyId: ID!
    $service: [String]
    $requester: [ID]
  ) {
    serviceRequests(
      where: {
        OR: [
          {
            status: { in: $status }
            service: { have: { name: { in: $service } } }
            requester: { have: { objectId: { in: $requester } } }
          }
        ]
        AND: [{ society: { have: { objectId: { equalTo: $societyId } } } }]
      }
      order: updatedAt_DESC
      first: 300
    ) {
      edges {
        node {
          id
          objectId
          createdAt
          status
          updatedAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;

export const GET_ALL_SERVICE_REQUESTS_NAME_BY_SOCIETY = gql`
  query serviceRequestsBySearch(
    $serviceName: String
    $first: Int!
    $after: String
    $displayId: Float
    $requesterName: String
    $societyName: String
    $societyId: ID!
  ) {
    serviceRequests(
      where: {
        society: { have: { objectId: { equalTo: $societyId } } }
        OR: [
          {
            service: {
              have: { name: { matchesRegex: $serviceName, options: "i" } }
            }
          }
          { displayId: { equalTo: $displayId } }
          {
            requester: {
              have: {
                firstName: { matchesRegex: $requesterName, options: "i" }
              }
            }
          }
          {
            society: {
              have: { name: { matchesRegex: $societyName, options: "i" } }
            }
          }
        ]
      }
      order: updatedAt_DESC
      first: $first
      after: $after
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          status
          createdAt
          updatedAt
          displayId
          service {
            name
            objectId
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          society {
            name
            objectId
          }
          visitDate
          visitRequirement
          referralCode
        }
      }
    }
  }
`;
