import { gql } from "@apollo/client";
export const GET_SOCIETIES = gql`
  query getSocietyList {
    societies(first: 4000) {
      edges {
        node {
          objectId
          name
          pincode
          city
          area
          state
          status
          email
        }
      }
    }
  }
`;

export const GET_SOCIETIES_BY_SOCIETY_IDS = gql`
  query getSocieties($societyIds: [ID]) {
    societies(first:10000,where: { objectId: { in: $societyIds } }) {
      edges {
        node {
          name
          objectId
          email
          addressLine1
          addressLine2
          pincode
          city
          area
          logo
          description
          services {
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
          }
        }
      }
    }
  }
`;
export const GET_SOCIETIES_BY_NAME_REGEX = gql`
  query societies($q: String = "", $memberSubquery: SocietyWhereInput = {}) {
    societies(
      where: {
        AND: [{ name: { matchesRegex: $q, options: "i" } }, $memberSubquery]
      }
      order: name_ASC
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
          name
          email
          addressLine1
          addressLine2
          city
          area
          pincode
          state
          status
        }
      }
    }
  }
`;
