import { gql } from '@apollo/client';

export const UPLOAD_BOOKINGS = gql`
  mutation uploadBookings($params: Object!) {
    callCloudCode(input: { functionName: uploadBookings, params: $params }) {
      result
    }
  }
`;
