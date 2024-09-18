import { gql } from "@apollo/client";

export const GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE = gql`
  query getServiceStaffForDate(
    $societyId: ID!
    $startDate: Date!
    $endDate: Date!
  ) {
    serviceStaffs(
      where: {
        AND: [
          {
            serviceSubscription: {
              have: { society: { have: { objectId: { equalTo: $societyId } } } }
            }
          }
          {
            serviceSubscription: {
              have: {
                service: { have: { requireAttendance: { equalTo: true } } }
              }
            }
          }
          {
            OR: [
              { startDate: { lessThanOrEqualTo: $startDate } }
              { startDate: { greaterThanOrEqualTo: $startDate } }
            ]
          }
          { endDate: { greaterThanOrEqualTo: $endDate } }
        ]
      }
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
          serviceSubscription {
            id
            objectId
            serviceEnded
            service {
              id
              objectId
              status
              name
              displayOrder
              requireAttendance
            }
          }
        }
      }
    }
  }
`;
