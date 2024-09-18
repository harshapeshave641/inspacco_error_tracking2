import { gql } from "@apollo/client";

export const GET_INCIDENT_COMMENTS = gql`
  query getIncidentComments($incidentId: ID!) {
    incident(id: $incidentId) {
      id
      objectId
      comments(order: createdAt_DESC) {
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
`;
