import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation updateUser(
    $userId: ID!
    $firstName: String!
    $lastName: String!
    $profilePicture: String
  ) {
    updateUser(
      input: {
        id: $userId
        fields: {
          firstName: $firstName
          lastName: $lastName
          profilePicture: $profilePicture
        }
      }
    ) {
      user {
        id
        objectId
        mobileNumber
        firstName
        lastName
        username
        email
        dob
        gender
      }
    }
  }
`;
