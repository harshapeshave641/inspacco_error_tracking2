import { gql } from '@apollo/client';

export const REGISTER_PUSH_NOTIFICATION = gql`
  mutation callCloudeCode($params: Object!) {
    callCloudCode(
      input: { functionName: registerPushNotification, params: $params }
    ) {
      result
    }
  }
`;
