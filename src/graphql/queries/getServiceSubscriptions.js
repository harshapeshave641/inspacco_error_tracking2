import { gql } from "@apollo/client";

export const GET_SERVICE_SUBSCRIPTIONS_BY_PARTNER = gql`
query getServiceSubscriptions($partnerId: ID!) {
  serviceSubscriptions(
    where: {partner: {have: {objectId: {equalTo: $partnerId}}}}
    first: 1000
    order: endDate_DESC
  ) {
    edges {
      node {
        id
        objectId
        startDate
        endDate
        status
        serviceEnded
        partner {
          id
          objectId
          name
        }
        service {
          id
          objectId
          name
        }
        society {
          id
          objectId
          name
        }
      }
    }
  }
}
`;

export const GET_SERVICE_SUBSCRIPTION = gql`
  query getServiceSubscription($id: ID!) {
    serviceSubscription(id: $id) {
      id
      objectId
      startDate
      endDate
      status
      serviceEnded
      partner {
        id
        objectId
        name
      }
      service {
        id
        objectId
        name
      }
      society {
        id
        objectId
        name
      }
    }
  }
`;
