import { gql } from '@apollo/client';

export const MARK_ATTENDANCE = gql`
  mutation callCloudeCode($params: Object!) {
    callCloudCode(input: { functionName: markAttendance, params: $params }) {
      result
    }
  }
`;
