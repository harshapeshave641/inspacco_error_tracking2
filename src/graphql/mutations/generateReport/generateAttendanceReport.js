import { gql } from '@apollo/client';

export const GENERATE_ATTENDANCE_REPORT = gql`
  mutation generateAttendanceReport($params: Object!) {
    callCloudCode(
      input: { functionName: GenerateAttendanceReport, params: $params }
    ) {
      result
    }
  }
`;
