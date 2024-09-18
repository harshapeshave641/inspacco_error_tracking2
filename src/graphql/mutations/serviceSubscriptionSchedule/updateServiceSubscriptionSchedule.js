import { gql } from '@apollo/client';

export const UPDATE_SERVICE_SUBSCRIPTION_SCHEDULE = gql`
  mutation updateServiceSubscriptionSchedule(
    $id: ID!
    $date: Date
    $remark: String
    $status: String
  ) {
    updateServiceSubscriptionSchedule(
      input: {
        id: $id
        fields: { date: $date, remark: $remark, status: $status }
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
