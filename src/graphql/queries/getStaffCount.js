import { gql } from "@apollo/client";

export const GET_STAFF_COUNT = gql`
  query serviceStaffs($serviceSubscriptionId: ID!, $date: Date!) {
    serviceStaffCount: serviceStaffs(
      where: {
        AND: [
          {
            serviceSubscription: {
              have: { objectId: { equalTo: $serviceSubscriptionId } }
            }
          }
          { startDate: { lessThanOrEqualTo: $date } }
          { endDate: { greaterThanOrEqualTo: $date } }
        ]
      }
    ) {
      count
    }
  }
`;
