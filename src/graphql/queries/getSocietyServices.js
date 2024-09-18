import { gql } from '@apollo/client/core';

export const GET_SOCIETY_SERVICES = gql`
  query getSocietyServices($societyId: ID!, $endDate: Date) {
    serviceSubscriptions(
      where: {
        society: { have: { objectId: { equalTo: $societyId } } }
        endDate: { greaterThanOrEqualTo: $endDate }
        serviceEnded: { equalTo: false }
      }
      order: endDate_ASC
    ) {
      edges {
        node {
          society {
            name
            status
            id
            objectId
          }
          service {
            name
            objectId
            status
          }
          partner {
            objectId
            name
          }
          objectId
          id
          endDate
          startDate
          status
        }
      }
    }
  }
`;
