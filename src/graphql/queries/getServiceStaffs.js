import { gql } from "@apollo/client";

export const GET_SERVICE_STAFFS = gql`
  query getAttendanceStaff($serviceSubscriptionId: ID!, $date: Date!) {
    serviceStaffs(
      where: {
        serviceSubscription: {
          have: { objectId: { equalTo: $serviceSubscriptionId } }
        }
        endDate: { greaterThanOrEqualTo: $date }
        startDate: { lessThanOrEqualTo: $date }
      }
      first: 50000
    ) {
      edges {
        node {
          staff {
            firstName
            lastName
            objectId
            mobileNumber
            profileImage
            id
            status
          }
          startDate
          endDate
          type
          id
          objectId
          status
        }
      }
    }
  }
`;
