import { gql } from '@apollo/client';

export const UPDATE_SERVICE_STAFF_BY_ID = gql`
  mutation updateServiceStaff(
    $id: ID!
    $staff: ID!
    $startDate: Date!
    $endDate: Date!
    $type: String!
    $status: String!
  ) {
    updateServiceStaff(
      input: {
        id: $id
        fields: {
          staff: { link: $staff }
          startDate: $startDate
          endDate: $endDate
          type: $type
          status: $status
        }
      }
    ) {
      serviceStaff {
        id
        objectId
        staff {
          id
          objectId
          firstName
          lastName
        }
        status
      }
    }
  }
`;
