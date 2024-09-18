import { gql } from '@apollo/client';

export const GET_SERVICE_REQUEST = gql`
  mutation getSeriveRequest($params: Object!) {
    callCloudCode(input: { functionName: GetServiceRequest, params: $params }) {
      result
    }
  }
`;
