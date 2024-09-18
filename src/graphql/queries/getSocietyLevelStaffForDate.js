import { gql } from "@apollo/client";

export const GET_SOCIETY_LEVEL_STAFF_FOR_DATE = gql`
  query getServiceStaffForDate($societyId: ID!, $date: Date!) {
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
