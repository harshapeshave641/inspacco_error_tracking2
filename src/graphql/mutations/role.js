import { gql } from "@apollo/client";

export const ASSIGN_ROLE_TO_USER = gql`
mutation assignRoleToUser($roleId: ID!, $users: [ID!]) {
    updateRole(
      input: { id: $roleId, fields: { users: { add: $users } } }
    ) {
      role {
        objectId,
        name
      }
    }
  }
`
export const REMOVE_ROLE_FROM_USER = gql`
mutation assignRoleToUser($roleId: ID!, $users: [ID!]) {
    updateRole(
      input: { id: $roleId, fields: { users: { remove: $users } } }
    ) {
      role {
        objectId,
        name
      }
    }
  }
`