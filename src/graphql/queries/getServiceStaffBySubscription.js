import { gql } from "@apollo/client";

export const GET_SERVICE_STAFF_BY_SUBSCRIPTION_ID = gql`
  query getServiceStaff($serviceSubscriptionId: ID!) {
    serviceStaffs(
      where: {
        serviceSubscription: {
          have: { objectId: { equalTo: $serviceSubscriptionId } }
        }
        staff: { have: { isDeleted: { equalTo: false } } }
        isTemporary: { notEqualTo: true }
      }
    ) {
      count
      edges {
        node {
          id
          objectId
          startDate
          status
          type
          endDate
          staff {
            firstName
            lastName
            id
            objectId
            mobileNumber
            profileImage
            status
          }
        }
      }
    }
  }
`;
