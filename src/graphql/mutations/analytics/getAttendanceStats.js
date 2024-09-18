import { gql } from '@apollo/client';

export const GET_ATTENDNCE_STATS = gql`
  mutation getAttendanceStats($params: Object!) {
    callCloudCode(
      input: { functionName: attendanceStats, params: $params }
    ) {
      result
    }
  }
`;
