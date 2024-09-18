import { gql } from '@apollo/client';

export const UPDATE_SERVICE_REQUEST_VISIT_DATE = gql`
  mutation updateServiceRequestVisitDate(
    $serviceRequestId: ID!
    $newDate: Date!
  ) {
    updateServiceRequest(
      input: { id: $serviceRequestId, fields: { visitDate: $newDate } }
    ) {
      serviceRequest {
        objectId
        id
        visitDate
      }
    }
  }
`;
