import { gql } from '@apollo/client';

export const GET_SOCIETY_STAFF_BY_ID = gql`
  query getSocietyStaff($id: ID!) {
    societyStaff(id: $id) {
      id
      objectId
      status
      isDeleted
      department
      employeeId
      society {
        objectId
        id
        name
      }
      user {
        firstName
        lastName
        mobileNumber
        profilePicture
      }
    }
  }
`;
