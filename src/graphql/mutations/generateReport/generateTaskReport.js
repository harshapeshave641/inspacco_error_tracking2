import { gql } from '@apollo/client';

export const GENERATE_TASK_REPORT = gql`
  mutation generateTaskReport($params: Object!) {
    callCloudCode(
      input: { functionName: GenerateTaskReport, params: $params }
    ) {
      result
    }
  }
`;
