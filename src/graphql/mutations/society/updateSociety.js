import { gql } from "@apollo/client";

export const UPDATE_SOCIETY_DETAILS = gql`
  mutation updateSociety($id: ID!, $logo: String, $description: String) {
    updateSociety(input: { id: $id, fields: { logo: $logo ,description:$description} }) {
      society {
        id
        objectId
        displayId
        name
        email
        area
        city
        pincode
        addressLine1
        addressLine2
        state
        status
        logo
        description
      }
    }
  }
`;
