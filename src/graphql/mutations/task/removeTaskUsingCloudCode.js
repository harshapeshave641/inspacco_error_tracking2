import { gql } from '@apollo/client';

export const REMOVE_TASK_USING_CLOUD_CODE = gql`
  mutation removeTask($params: Object!) {
    callCloudCode(input: { functionName: removeTask, params: $params }) {
      result
    }
  }
`;
