import { gql } from "@apollo/client";

export const GET_POPULAR_SERVICES = gql`
  query getPopularServices($status: String = "Active", $first: Int = 8) {
    services(
      where: { status: { equalTo: $status }, isPopular: { equalTo: true } }
      order: displayOrder_ASC
      first: $first
    ) {
      edges {
        node {
          serviceKey
          objectId
          id
          name
          isPopular
          inclusionText
          description
          qualityAssuranceText
          requireAttendance
          requirementForm
          status
          visibleTo
          updatedAt
        }
      }
      count
    }
  }
`;

export const GET_SERVICES = gql`
  query getPopularServices($status: String = "Active", $first: Int = 8) {
    services(
      where: { status: { equalTo: $status }, isStandard: { equalTo: true } }
      order: name_ASC
      first: $first
    ) {
      edges {
        node {
          serviceKey
          objectId
          id
          name
          isPopular
          inclusionText
          description
          qualityAssuranceText
          requireAttendance
          requirementForm
          status
          visibleTo
          updatedAt
        }
      }
      count
    }
  }
`;
