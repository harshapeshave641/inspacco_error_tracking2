import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $mobilenumber: String!
    $firstname: String!
    $lastname: String !
    $profilepicture: String
  ) {
    createUser(
      input: {
        fields: {
          username: $username
          mobileNumber: $mobilenumber
          firstName: $firstname
          lastName: $lastname
          profilePicture: $profilepicture
          totalRewardPoints: 0
          password: "inspacco123"
        }
      }
    ) {
      user {
        id
        username
        mobileNumber
        firstName
        lastName
        objectId
      }
    }
  }
`;
