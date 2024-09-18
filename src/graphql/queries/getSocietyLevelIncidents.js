import { gql } from "@apollo/client";

export const GET_SOCIETY_LEVEL_INCIDENTS = gql`
  query getSocietyLevelIncidents(
    $societyId: ID!
    $status: [String]
    $recordCount: Int,
    $startDate: Date!,
    $endDate: Date!
  ) {
    incidents(
      where: {
        serviceSubscription: {
          have: { society: { have: { objectId: { equalTo: $societyId } } } }
        }
        createdAt: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        status: { in: $status }
      }
      first: $recordCount
      order: updatedAt_DESC
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          createdBy {
            id
            objectId
            firstName
            lastName
          }
          comments(order: createdAt_DESC) {
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
                  profilePicture
                }
              }
            }
          }
          updatedBy {
            id
            objectId
            firstName
            lastName
          }
          serviceSubscription {
            id
            objectId
            society {
              objectId
              name
            }
            service {
              id
              objectId
              name
            }
          }
          category
          priority
          summary
          description
          status
          assignedGroup
          assignee {
            id
            objectId
            firstName
            lastName
          }
          displayId
        }
      }
    }
  }
`;

export const GET_ALL_COMPLAINTS_NAME_BY_SEARCH_SOCIETY = gql`
  query incidents(
    $serviceName: String
    $first: Int!
    $after: String
    $displayId: Float
    $summary: String
    $societyId: ID!
  ) {
    incidents(
      where: {
        serviceSubscription: {
          have: { society: { have: { objectId: { equalTo: $societyId } } } }
        }
        OR: [
          {
            serviceSubscription: {
              have: {
                service: {
                  have: { name: { matchesRegex: $serviceName, options: "i" } }
                }
              }
            }
          }
          { displayId: { equalTo: $displayId } }
          { summary: { matchesRegex: $summary, options: "i" } }
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
          serviceSubscription {
            objectId
            service {
              objectId
              name
              description
            }
            society {
              objectId
              name
            }
          }
          priority
          summary
        }
      }
    }
  }
`;

export const GET_ALL_COMPLAINTS_NAME_BY_SEARCH_INSPACCO = gql`
  query incidents(
    $serviceName: String
    $first: Int!
    $after: String
    $displayId: Float
    $summary: String
  ) {
    incidents(
      where: {
        OR: [
          {
            serviceSubscription: {
              have: {
                service: {
                  have: { name: { matchesRegex: $serviceName, options: "i" } }
                }
              }
            }
          }
          { displayId: { equalTo: $displayId } }
          { summary: { matchesRegex: $summary, options: "i" } }
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
          serviceSubscription {
            objectId
            service {
              objectId
              name
              description
            }
            society {
              objectId
              name
            }
          }
          priority
          summary
        }
      }
    }
  }
`;

export const GET_ALL_COMPLAINTS_BY_FILTER_SOCIETY = gql`
  query FilterIncidents(
    $status: [String]
    $priority: [String]
    $service: [String]
    $societyId: ID!
    $assigneeId: [ID]
  ) {
    incidents(
      where: {
        OR: [
          {
            status: { in: $status }
            priority: { in: $priority }
            serviceSubscription: {
              have: { service: { have: { name: { in: $service } } } }
            }
            assignee: { have: { objectId: { in: $assigneeId } } }
          }
        ]
        serviceSubscription: {
          have: { society: { have: { objectId: { equalTo: $societyId } } } }
        }
      }
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
          serviceSubscription {
            objectId
            society {
              objectId
              name
            }
            partner {
              objectId
              name
            }
            service {
              objectId
              name
            }
          }
          category
          priority
          summary
          status
        }
      }
    }
  }
`;

export const GET_ALL_COMPLAINTS_BY_FILTER_INSPACCO = gql`
  query FilterIncidents(
    $status: [String]
    $priority: [String]
    $service: [String]
  ) {
    incidents(
      where: {
        OR: [
          {
            status: { in: $status }
            priority: { in: $priority }
            serviceSubscription: {
              have: { service: { have: { name: { in: $service } } } }
            }
          }
        ]
      }
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
          serviceSubscription {
            objectId
            society {
              objectId
              name
            }
            partner {
              objectId
              name
            }
            service {
              objectId
              name
            }
          }
          category
          priority
          summary
          status
        }
      }
    }
  }
`;
