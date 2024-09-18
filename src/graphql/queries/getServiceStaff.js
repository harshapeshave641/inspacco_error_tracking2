import { gql } from "@apollo/client";

export const GET_SERVICE_STAFF_BY_ID = gql`
  query getServiceStaff($id: ID!) {
    serviceStaff(id: $id) {
      id
      objectId
      type
      startDate
      endDate
      status
      staff {
        id
        objectId
        firstName
        lastName
        profileImage
        mobileNumber
      }
      serviceSubscription {
        id
        objectId
        partner {
          id
          objectId
        }
      }
    }
  }
`;
