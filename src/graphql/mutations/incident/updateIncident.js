import { gql } from '@apollo/client';

export const UPDATE_INCIDENT_BY_ID = gql`
  mutation UpdateIncident(
    $id: ID!
    $description: String
    $priority: String
    $category: String
    $summary: String
    $status: String
    $action: String
    $value: String
    $userId: ID
    $assignee: ID!
    $assignedGroup: String
  ) {
    updateIncident(
      input: {
        id: $id
        fields: {
          description: $description
          priority: $priority
          category: $category
          summary: $summary
          status: $status
          activityHistory: {
            createAndAdd: {
              action: $action
              value: $value
              createdBy: { link: $userId }
            }
          }
          assignee: { link: $assignee }
          assignedGroup: $assignedGroup
        }
      }
    ) {
      incident {
        objectId
        id
        status
        summary
        description
        activityHistory {
          edges {
            node {
              objectId
              createdBy {
                objectId
                firstName
                lastName
              }
              value
              action
            }
          }
        }
        serviceSubscription {
          id
          objectId
        }
        category
        assignedGroup
      }
    }
  }
`;

export const UPDATE_INCIDENT_ATTACHMENT_BY_ID = gql`
  mutation UpdateIncident($id: ID!, $attachments: [ID!]) {
    updateIncident(
      input: { id: $id, fields: { attachments: { add: $attachments } } }
    ) {
      incident {
        objectId
        id
        status
        summary
        description
        attachments {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_INCIDENT_BY_ID_WITHOUGT_ACTIVITY_HISTORY = gql`
  mutation UpdateIncident(
    $id: ID!
    $description: String
    $priority: String
    $category: String
    $summary: String
    $assignee: ID!
    $assignedGroup: String
  ) {
    updateIncident(
      input: {
        id: $id
        fields: {
          description: $description
          priority: $priority
          category: $category
          summary: $summary
          assignee: { link: $assignee }
          assignedGroup: $assignedGroup
        }
      }
    ) {
      incident {
        objectId
        id
        status
        summary
        description
        activityHistory {
          edges {
            node {
              objectId
              createdBy {
                objectId
                firstName
                lastName
              }
              value
              action
            }
          }
        }
        serviceSubscription {
          id
          objectId
        }
        category
        assignedGroup
      }
    }
  }
`;
export const UPDATE_INCIDENT_COMMENTS = gql`
  mutation UpdateIncidentComment($incidentId: ID!, $commentIds: [ID!]!) {
    updateIncident(
      input: { id: $incidentId, fields: { comments: { add: $commentIds } } }
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

