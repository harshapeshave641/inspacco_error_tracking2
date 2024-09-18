import { gql } from "@apollo/client";

export const GET_SERVICE_BY_ID = gql`
  query getService($id: ID!) {
    service(id: $id) {
      id
      objectId
      name
      description
      status
      requireAttendance
      requirementForm
      serviceKey
      isPopular
      inclusionText
      qualityAssuranceText
      status
      visibleTo
      updatedAt
    }
  }
`;
