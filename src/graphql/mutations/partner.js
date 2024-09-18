import { gql } from '@apollo/client';

export const CREATE_PARTNER = gql`
  mutation CreatePartner(
    $fields: CreatePartnerFieldsInput = {
      name: ""
      email: ""
      status: "Active"
      address: {
        addressLine1: ""
        addressLine2: ""
        area: ""
        city: ""
        state: ""
        pincode: ""
      }
      pan: ""
      gstNumber: ""
      verified: false
    }
  ) {
    createPartner(
      input: { fields: $fields, clientMutationId: "CreatePartner" }
    ) {
      clientMutationId
      partner {
        address
        gstNumber
        id
        name
        email
        objectId
        pan
        experience
        estd
        numberOfClients
      }
    }
  }
`;

export const UPDATE_PARTNER = gql`
  mutation UpdatePartner(
   $id:ID!,
   $fields: UpdatePartnerFieldsInput = {
      name: ""
      email: ""
      status: "Active"
      address: {
        addressLine1: ""
        addressLine2: ""
        area: ""
        city: ""
        state: ""
        pincode: ""
      }
      pan: ""
      gstNumber: ""
      verified: false
      ratingParameters:{}
    }
  ) {
    updatePartner(
      input: {
        id: $id
        fields: $fields
      }
    ) {
      partner {
        objectId
        id
        status
        name
        description
      }
    }
  }
`;