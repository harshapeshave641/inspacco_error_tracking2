import { gql } from "@apollo/client";

export const GET_RECENT_SERVICE_REQUESTS_FOR_PARTNER = gql`
  query recentServiceRequests($partnerId: ID!, $recordCount: Int) {
    partnerServiceRequests(
      order: createdAt_DESC
      where: { partner: { have: { objectId: { equalTo: $partnerId } } } }
      first: $recordCount
    ) {
      edges {
        node {
          id
          objectId
          displayId
          status
          updatedAt
          partner {
            name
            objectId
          }
          service {
            name
            objectId
          }
          visitDate
          visitRequirement
        }
      }
    }
  }
`;

export const GET_ALL_PARTNER_SERVICE_REQUESTS_BY_DATE = gql`
  query serviceRequests(
    $startDate: Date
    $endDate: Date
    $status: [String]
    $partnerId: ID!
  ) {
    partnerServiceRequests(
      where: {
        OR: [{ status: { in: $status } }]
        AND: [
          { updatedAt: { greaterThanOrEqualTo: $startDate } }
          { updatedAt: { lessThanOrEqualTo: $endDate } }
          { partner: { have: { objectId: { equalTo: $partnerId } } } }
        ]
      }
      order: updatedAt_DESC
      first: 300
    ) {
      edges {
        node {
          id
          objectId
          displayId
          status
          updatedAt
          partner {
            name
            objectId
            description
          }
          service {
            name
            objectId
          }
          visitDate
          visitRequirement
        }
      }
    }
  }
`;
