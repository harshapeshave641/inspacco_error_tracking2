import { gql } from '@apollo/client';

export const CREATE_SERVICE_STAFF = gql`
  mutation createServiceStaffMutation(
    $staff: ID!
    $startDate: Date!
    $endDate: Date!
    $serviceSubscription: ID!
    $type: String
  ) {
    createServiceStaff(
      input: {
        fields: {
          staff: { link: $staff }
          startDate: $startDate
          endDate: $endDate
          serviceSubscription: { link: $serviceSubscription }
          type: $type
          status: "Active"
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
