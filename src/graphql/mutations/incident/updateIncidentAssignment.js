import { gql } from "@apollo/client";

export const UPDATE_INCIDENT_ASSIGNMENT = gql`
  mutation UpdateIncidentASSIGNMENT(
    $id: ID!
    $assignee: ID!
    $assignedGroup: String!
  ) {
    updateIncident(
      input: {
        id: $id
        fields: { assignee: { link: $assignee }, assignedGroup: $assignedGroup }
      }
    ) {
      incident {
        objectId
        id
        status
        summary
        description
        serviceSubscription {
          id
          objectId
        }
        category
        assignedGroup
        assignee {
          objectId
          firstName
          lastName
        }
      }
    }
  }
`;
