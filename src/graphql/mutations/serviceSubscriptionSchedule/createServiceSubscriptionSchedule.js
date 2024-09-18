import { gql } from '@apollo/client';

export const CREATE_SERVICE_SUBSCRIPTION_SCHEDULE = gql`
  mutation addServiceSubscriptionSchedule(
    $serviceSubscriptionId: ID!
    $date: Date!
    $remark: String
    $status: String! = "UPCOMING"
  ) {
    createServiceSubscriptionSchedule(
      input: {
        fields: {
          serviceSubscription: { link: $serviceSubscriptionId }
          date: $date
          remark: $remark
          status: $status
        }
      }
    ) {
      serviceSubscriptionSchedule {
        id
        objectId
        date
      }
    }
  }
`;
