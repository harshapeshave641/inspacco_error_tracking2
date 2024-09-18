import { gql } from "@apollo/client";

export const GET_SERVICE_LEVEL_STAFF_FOR_DATE = gql`
  query getServiceStaffForDate($serviceSubscriptionsIds: [ID!], $date: Date!) {
    serviceStaffs(
      where: {
        AND: [
          {
            serviceSubscription: {
              have: { objectId: { in: $serviceSubscriptionsIds } }
            }
          }
          {
            serviceSubscription: {
              have: { endDate: { greaterThanOrEqualTo: $date } }
            }
          }
          { startDate: { lessThanOrEqualTo: $date } }
          { endDate: { greaterThanOrEqualTo: $date } }
        ]
      }
      first: 50000
    ) {
      edges {
        node {
          id
          objectId
          serviceSubscription {
            id
            objectId
            service {
              id
              objectId
              status
              name
            }
          }
        }
      }
    }
  }
`;
