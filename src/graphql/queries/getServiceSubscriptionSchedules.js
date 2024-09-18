import { gql } from "@apollo/client";

export const GET_SERVICE_SUBSCRIPTION_SCHEDULES = gql`
  query getServiceSubscriptionSchedules($serviceSubscriptionId: ID!) {
    serviceSubscriptionSchedules(
      where: {
        serviceSubscription: {
          have: { objectId: { equalTo: $serviceSubscriptionId } }
        }
      }
      order: date_ASC
    ) {
      edges {
        node {
          id
          objectId
          date
          remark
          status
          comments {
            count
            edges {
              node {
                objectId
                createdBy {
                  firstName
                  lastName
                  profilePicture
                  objectId
                }
                createdAt
                updatedAt
                comment
              }
            }
          }
          serviceSubscription {
            id
            objectId
            service {
              id
              objectId
              name
            }
          }
        }
      }
    }
  }
`;
