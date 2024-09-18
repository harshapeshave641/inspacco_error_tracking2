import { gql } from "@apollo/client";

export const LOGIN_WITH = gql`
  mutation LoginWithPhoneAuth($authData: Object!) {
    logInWith(input: { authData: $authData }) {
      viewer {
        user {
          objectId
          username
          firstName
          lastName
          mobileNumber
          totalRewardPoints
          gender
          email
          dob
        }
        sessionToken
      }
    }
  }
`;
