import { gql } from '@apollo/client';

export const UPDATE_SOCIETY_STAFF = gql`
  mutation updateSocietyStaffMutation(
    $id: ID!
    $department: String
    $employeeId: String
  ) {
    updateSocietyStaff(
      input: {
        id: $id
        fields: { department: $department, employeeId: $employeeId }
      }
    ) {
      societyStaff {
        id
        status
        objectId
        department
        employeeId
        user {
          firstName
          lastName
          mobileNumber
          profilePicture
        }
      }
    }
  }
`;
