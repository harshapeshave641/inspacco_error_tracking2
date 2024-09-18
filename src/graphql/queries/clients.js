import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query getClients {
    societies(first: 100) {
      edges {
        node {
          objectId
          name
          city
          state
        }
      }
    }
  }
`;

export const GET_SOCIETIES = gql`
  query societies($q: String = "", $memberSubquery: SocietyWhereInput = {}) {
    societies(
      where: {
        AND: [{ name: { matchesRegex: $q, options: "i" } }, $memberSubquery]
      }
      order: name_ASC
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
          name
          email
          GSTState
          GSTNo
          POCMobileNumber
          POCName
          registeredEntityName
          POCEmail
          clientPhoneNumber
          CINNumber
          addressLine1
          addressLine2
          city
          area
          pincode
          state
          status
          societyLat
          societyLong
          settings
        }
      }
    }
  }
`;
