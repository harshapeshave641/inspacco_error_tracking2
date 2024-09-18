import { gql } from "@apollo/client";

export function getSocietySubquery(currentUserId, activeRole) {
  return {
    serviceSubscription: {
      have: {
        society: {
          have: {
            objectId: {
              inQueryKey: {
                key: "society.objectId",
                query: {
                  className: "SocietyMember",
                  where: {
                    AND: [
                      { type: { equalTo: activeRole } },
                      { member: { equalTo: currentUserId } },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function getIncidentSubQuery(filterObject) {
  const { status, startDate, endDate } = filterObject;

  return {
    ...{
      ...(status && { status: { in: status } }),
      ...(startDate && { createdAt: { greaterThanOrEqualTo: startDate } }),
      ...(endDate && { updatedAt: { lessThanOrEqualTo: endDate } }),
    },
  };
}

export const GET_TOTAL_INCIDENTS_COUNT = gql`
  query getIncidentsCount($subQuery: IncidentWhereInput = {}) {
    totalIncidents: incidents(where: $subQuery) {
      count
    }
  }
`;

export const GET_INCIDENTS = gql`
  query incidents($subQuery: IncidentWhereInput = {}, $limit: Int, $skip: Int) {
    incidents(
      where: $subQuery
      order: updatedAt_DESC
      first: $limit
      skip: $skip
    ) {
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
            service {
              id
              objectId
              name
            }
            society {
              objectId
              name
            }
            partner {
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

// export const GET_INCIDENTS_BY_DATERANGE = gql`
//   query FilterIncidents($startDate: Date, $endDate: Date, $societyId: ID!) {
//     incidents(
//       where: {
//         AND: [
//           { createdAt: { greaterThanOrEqualTo: $startDate } }
//           { updatedAt: { lessThanOrEqualTo: $endDate } }
//           { serviceSubscription { have: society: { have: { objectId: { equalTo: $societyId } } } } }
//         ]
//       }
//       order: updatedAt_DESC
//       first: 300
//     ) {
//       edges {
//         node {
//           id
//           objectId
//           status
//           createdAt
//           updatedAt
//           displayId
//           serviceSubscription {
//             objectId
//             society {
//               objectId
//               name
//             }
//             partner {
//               objectId
//               name
//             }
//             service {
//               objectId
//               name
//             }
//           }
//           category
//           priority
//           summary
//           status
//         }
//       }
//     }
//   }
// `;
