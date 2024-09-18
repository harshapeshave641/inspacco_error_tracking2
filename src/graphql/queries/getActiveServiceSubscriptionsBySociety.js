import { gql } from "@apollo/client";

export const GET_ALL_SERVICE_SUBSCRIPTIONS_BY_QUERY = gql`
  query getAllServiceSubscriptions ($subQuery:ServiceSubscriptionWhereInput){
    serviceSubscriptions(where:$subQuery, first: 1000) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          partner {
            objectId
            name
            description
          }
        }
      }
    }
  }
`;

export const GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY = gql`
  query getActiveServiceSubscriptionsForSociety(
    $societyId: ID!
    $today: Date!
  ) {
    serviceSubscriptions(
      where: {
        startDate: { lessThanOrEqualTo: $today }
        endDate: { greaterThanOrEqualTo: $today }
        status: { equalTo: "Active" }
        society: { have: { objectId: { equalTo: $societyId } } }
      }
    ) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          service {
            id
            objectId
            name
          }
          society {
            objectId
            name
          }
          partner {
            objectId
            name
            description
          }
        }
      }
    }
  }
`;
