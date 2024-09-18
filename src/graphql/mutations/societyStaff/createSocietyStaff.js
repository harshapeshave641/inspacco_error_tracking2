import { gql } from '@apollo/client';

export const CREATE_SOCIETY_STAFF = gql`
  mutation createSocietyStaff(
    $societyId: ID!
    $firstName: String!
    $lastName: String!
    $mobileNumber: String!
    $profileImage: String
    $department: String
    $employeeId: String
  ) {
    createSocietyStaff(
      input: {
        fields: {
          society: { link: $societyId }
          user: {
            createAndLink: {
              firstName: $firstName
              lastName: $lastName
              mobileNumber: $mobileNumber
              username: $mobileNumber
              profilePicture: $profileImage
              password: "sss"
              totalRewardPoints: 0
            }
          }
          status: "Active"
          department: $department
          employeeId: $employeeId
        }
      }
    ) {
      societyStaff {
        id
        status
        objectId
        department
        user {
          firstName
          lastName
          mobileNumber
          profilePicture
        }
      }
    }
  }
`;
