import { gql } from "@apollo/client";

export const CREATE_SERVICE_REQUEST = gql`
  mutation createServiceRequest($input: CreateServiceRequestInput!) {
    createServiceRequest(input: $input) {
      serviceRequest {
        id
        objectId
        service {
          objectId
          name
        }
        partner {
          objectId
          name
        }
        society {
          objectId
          name
          area
        }
        displayId
        requirement
        referralCode
        subService
      }
    }
  }
`;
