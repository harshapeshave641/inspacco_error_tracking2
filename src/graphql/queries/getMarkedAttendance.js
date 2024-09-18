import { gql } from "@apollo/client";

export const GET_MARKED_ATTENDACE = gql`
  query getMarkedAttendance(
    $serviceSubscriptionId: ID!
    $startDate: Date!
    $endDate: Date!
  ) {
    attendances(
      where: {
        date: { greaterThanOrEqualTo: $startDate, lessThan: $endDate }
        serviceStaff: {
          have: {
            serviceSubscription: {
              have: { objectId: { equalTo: $serviceSubscriptionId } }
            }
          }
        }
      }
      first: 50000
    ) {
      edges {
        node {
          attendanceDetails
          isPresent
          date
          objectId
          id
          shift
          isTemporary
          inTime
          outTime
          mode
          serviceStaff {
            staff {
              firstName
              id
              lastName
              mobileNumber
              objectId
              profileImage
              status
            }
            id
            objectId
            type
            status
          }
        }
      }
    }
  }
`;
