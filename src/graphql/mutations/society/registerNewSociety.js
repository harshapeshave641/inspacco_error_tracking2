import { gql } from "@apollo/client";

export const REGISTER_NEW_SCOIETY = gql`
  mutation addClientRegistrationRequestion(
    $clientType: String!
    $clientName: String!
    $email: String!
    $pincode: String!
    $address: String!
    $message: String!
  ) {
    createClientRegistrationRequest(
      input: {
        fields: {
          pincode: $pincode
          address: $address
          clientType: $clientType
          clientName: $clientName
          email: $email
          message: $message
        }
      }
    ) {
      clientRegistrationRequest {
        objectId
        clientName
        clientType
        message
      }
    }
  }
`;
