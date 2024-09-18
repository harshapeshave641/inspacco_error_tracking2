import { gql } from "@apollo/client";

export const GET_ATTENDANCE_FOR_DATE = gql`
  query getAttendance(
    $serviceSubscriptionIds: [ID!]
    $startDate: Date!
    $endDate: Date!
  ) {
    attendances(
      where: {
        AND: [
          {
            serviceStaff: {
              have: {
                serviceSubscription: {
                  have: { objectId: { in: $serviceSubscriptionIds } }
                }
              }
            }
          }
          { date: { greaterThanOrEqualTo: $startDate } }
          { date: { lessThanOrEqualTo: $endDate } }
        ]
      }
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
          date
          serviceStaff {
            serviceSubscription {
              id
              objectId
            }
            staff {
              id
              objectId
              firstName
              lastName
              mobileNumber
              profileImage
            }
            shift {
              id
              objectId
              shiftType
              startTime
              endTime
            }
            type
          }
          shift
          isPresent
          isTemporary
          attendanceDetails
          inTime
          outTime
          mode
        }
      }
    }
  }
`;
