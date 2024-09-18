import { gql } from '@apollo/client';

export const DELETE_SERVICE_SUBSCRIPTION_SCHEDULE = gql`
  mutation deleteServiceSubscriptionSchedule($id: ID!) {
    deleteServiceSubscriptionSchedule(input: { id: $id }) {
      serviceSubscriptionSchedule {
        id
        objectId
      }
    }
  }
`;
