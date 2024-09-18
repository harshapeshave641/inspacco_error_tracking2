import { gql } from '@apollo/client';

export const GET_SOCIETY_STAFFS = gql`
  query getSocietyStaffs($societyId: ID!) {
    societyStaffs(
      where: {
        society: { have: { objectId: { equalTo: $societyId } } }
        isDeleted: { equalTo: false }
      }
      first: 5000
    ) {
      count
      edges {
        node {
          id
          objectId
          status
          isDeleted
          department
          employeeId
          society {
            objectId
            id
            name
          }
          user {
            firstName
            lastName
            mobileNumber
            objectId
            profilePicture
          }
        }
      }
    }
  }
`;
export const GET_SOCIETY_STAFF_SEARCH_QUERY = gql`
  query getSocietyStaffs($societyId: ID!, $searchString: String) {
    societyStaffs(
      where: {
        OR: [
          {
            user: {
              have: { firstName: { matchesRegex: $searchString, options: "i" } }
            }
          }
          {
            user: {
              have: { lastName: { matchesRegex: $searchString, options: "i" } }
            }
          }
          {
            user: {
              have: {
                mobileNumber: { matchesRegex: $searchString, options: "i" }
              }
            }
          }
          { department: { matchesRegex: $searchString, options: "i" } }
        ]
        society: { have: { objectId: { equalTo: $societyId } } }
      }
      first: 5000
    ) {
      count
      edges {
        node {
          id
          objectId
          status
          isDeleted
          department
          society {
            objectId
            id
            name
          }
          user {
            firstName
            lastName
            mobileNumber
            profilePicture
          }
        }
      }
    }
  }
`;
