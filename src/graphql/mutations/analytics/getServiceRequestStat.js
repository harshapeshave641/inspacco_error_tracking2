import { gql } from '@apollo/client';

export const GET_SERVICEREQUESTS_STAT = gql`
  mutation getServiceRequestStats($params: Object!) {
    callCloudCode(
      input: { functionName: serviceRequestMonthWiseCount, params: $params }
    ) {
      result
    }
  }
`;
