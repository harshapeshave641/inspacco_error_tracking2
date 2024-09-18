import { gql } from '@apollo/client';

export const CREATE_INCIDENT = gql`
  mutation CreateIncident(
    $category: String!
    $description: String!
    $priority: String!
    $status: String!
    $summary: String!
    $serviceSubscription: ID!
    $assignee: ID!
    $assignedGroup: String
  ) {
    createIncident(
      input: {
        fields: {
          category: $category
          description: $description
          priority: $priority
          status: $status
          summary: $summary
          serviceSubscription: { link: $serviceSubscription }
          assignee: { link: $assignee }
          assignedGroup: $assignedGroup
        }
      }
    ) {
      incident {
        objectId
        id
        serviceSubscription{
          objectId
          society{
            objectId
          }
          partner{
            objectId
          }
        }
      }
    }
  }
`;

export const ADD_INCIDENT_COMMENT = gql`
  mutation AddIncidentComment($incidentId: ID!, $comment: String!) {
    updateIncident(
      input: {
        id: $incidentId
        fields: { comments: { createAndAdd: { comment: $comment } } }
      }
    ) {
      incident {
        id
        objectId
        comments {
          edges {
            node {
              id
              objectId
              comment
              createdAt
              createdBy {
                id
                objectId
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;
