import { gql } from "@apollo/client";

export const GET_USERS_BY_MOBILE_NO = gql`
  query getUsersByMobileNumber($mobileNumber: String) {
    users(where: { mobileNumber: { equalTo: $mobileNumber } }) {
      edges {
        node {
          mobileNumber
          objectId
        }
      }
    }
  }
`;
