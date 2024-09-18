import { gql } from "@apollo/client";

// Define your GraphQL queries and mutations here
export const GET_ALL_CLIENT_FACILITIES = gql`
  query getAllClientFacilities($clientId: ID!) {
  clientFacilities(
    first: 100000
    where: {client: {have: {objectId: {equalTo: $clientId}}}}
  ){
    edges {
    node {
      objectId
      name
      uniqueCode
      pincode
      city
      state
      region
      address
      POCEmail
      POCMobileNumber
      POCName
    }
  }
}
  }
  
  `
export const SEARCH_FACILITY_BY_UNIIQUECODE = gql`
query searchClientFacilityByUniqueCode($clientId: ID!, $uniqueCode: String) {
  clientFacilities(
    first: 100000
    where: {client: {have: {objectId: {equalTo: $clientId}}}, uniqueCode: {equalTo: $uniqueCode}}
  ) {
    edges {
      node {
        objectId
        name
        uniqueCode
        pincode
        city
        state
        region
        address
        POCEmail
        POCMobileNumber
        POCName
      }
    }
  }
}

`
