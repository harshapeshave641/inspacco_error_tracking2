import { gql } from '@apollo/client';

export const UPDATE_END_DATE_FOR_SERVICE_STAFF_BY_ID = gql`
  mutation updateServiceStaff($id: ID!, $endDate: Date!) {
    updateServiceStaff(input: { id: $id, fields: { endDate: $endDate } }) {
      serviceStaff {
        id
        objectId
        endDate
      }
    }
  }
`;
