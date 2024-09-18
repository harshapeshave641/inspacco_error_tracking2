import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  mutation getTasks($params: Object!) {
    callCloudCode(input: { functionName: GetTasks, params: $params }) {
      result
    }
  }
`;
