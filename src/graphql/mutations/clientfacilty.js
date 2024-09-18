import { gql } from "@apollo/client";

export const CREATE_CLIENT_FACILITY = gql`
mutation CreateClientFacility($input: CreateClientFacilityFieldsInput!) {
  createClientFacility(input: {fields:$input}) {
    clientFacility {
      objectId
      createdAt
      updatedAt
    }
  }
}`
export const UPDATE_CLIENT_FACILITY = gql`
mutation UpdateClientFacility(
   $id:ID!,
   $fields: UpdateClientFacilityFieldsInput
  ) {
    updateClientFacility(
      input: {
        id: $id
        fields: $fields
      }
    ) {
      clientFacility {
        objectId
        id
        uniqueCode
        name
      }
    }
  }
`

export const DELETE_CLIENT_FACILITY = gql`
  mutation DeleteClientFacilty($id: ID!) {
    deleteClientFacility(input: { id: $id }) {
      clientFacility {
        id
        objectId
      }
    }
  }
`;
