import { gql } from "@apollo/client";

export const GENERATE_OTP = gql`
  mutation callCloudeCode($params: Object!) {
    callCloudCode(input: { functionName: generateOtp, params: $params }) {
      result
    }
  }
`;
