import { gql } from '@apollo/client';

export const GENERATE_COMPLAINT_REPORT = gql`
  mutation generateComplaintReport($params: Object!) {
    callCloudCode(
      input: { functionName: GenerateComplaintReport, params: $params }
    ) {
      result
    }
  }
`;
