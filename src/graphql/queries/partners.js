import { gql } from "@apollo/client";

export const GET_ALL_PARTNERS = gql`
  query getPartnerList {
    partners(first: 3000) {
      edges {
        node {
          objectId
          name
        }
      }
    }
  }
`;

export const GET_TOTAL_PARTNER_COUNT = gql`
  query getPartnerCount($subQuery: PartnerWhereInput = {}) {
    totalPartners: partners(where: $subQuery) {
      count
    }
  }
`;

export const GET_PARTNERS = gql`
  query partners(
    $subQuery: PartnerWhereInput = {}
    $limit: Int = 50
    $skip: Int = 0
  ) {
    partners(where: $subQuery, order: name_ASC, first: $limit, skip: $skip) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          name
          serviceNames
          estd
          status
          address
          preferedLanguage
          rating
        }
      }
    }
  }
`;

export const GET_SERVICE_PARTNERS = gql`
  query partners($serviceName: String!) {
    partners(
      where: {
        status: { equalTo: "Active" }
        serviceNames: { matchesRegex: $serviceName }
      }
      order: name_ASC
    ) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          name
          serviceNames
          estd
          status
          address
          preferedLanguage
          rating
        }
      }
    }
  }
`;

export const GET_PARTNER_BY_ID_QUERY = gql`
  query getPartner($id: ID!) {
    partner(id: $id) {
      address
      gstNumber
      id
      name
      email
      objectId
      pan
      experience
      fullAddress
      website
      estd
      numberOfClients
      mobileNumber
      preferedLanguage
      rating
      ratingParameters
      serviceNames
      description
      clients {
        edges {
          node {
            objectId
            name
            city
            area
            state
            logo
          }
        }
      }
      services {
        ... on Service {
          id
          name
          description
          objectId
          status
          requireAttendance
        }
      }
    }
  }
`;
