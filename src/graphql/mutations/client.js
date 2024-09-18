
import { gql } from "@apollo/client";


export const ADD_SOCIETIES = gql`
  mutation addSociety(
    $name: String!
    $email: String!
    $GSTState: String!
    $GSTNo: String!
    $POCMobileNumber: String!
    $POCName: String!
    $registeredEntityName: String!
    $POCEmail: String!
    $clientPhoneNumber: String!
    $CINNumber: String!
    $address1: String!
    $address2: String!
    $pincode: Float!
    $area: String!
    $city: String!
    $state: String!
    $societyLong: String!
    $societyLat: String!
  ) {
    createSociety(
      input: {
        fields: {
          name: $name
          email: $email
          GSTState: $GSTState
          GSTNo: $GSTNo
          POCMobileNumber: $POCMobileNumber
          POCName: $POCName
          registeredEntityName: $registeredEntityName
          POCEmail: $POCEmail
          clientPhoneNumber: $clientPhoneNumber
          CINNumber: $CINNumber
          addressLine1: $address1
          addressLine2: $address2
          pincode: $pincode
          area: $area
          city: $city
          state: $state
          societyLat: $societyLat
          societyLong: $societyLong
          status: "Active"
        }
      }
    ) {
      society {
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
        pincode
        area
        city
        state
        societyLat
        societyLong
      }
    }
  }
`;
export const UPDATE_SOCIETY_SETTINGS = gql`
 mutation updateSocietySetting(
 $id: ID!
 $settings:Object){
  updateSociety(input:{id:$id,fields:{settings:$settings}}){
    society{
      settings
    }
  }
 }`


export const UPDATE_SOCIETY = gql`
  mutation updateSociety(
    $id: ID!
    $name: String!
    $email: String
    $GSTState: String
    $GSTNo: String
    $POCMobileNumber: String
    $POCName: String
    $registeredEntityName: String
    $POCEmail: String
    $clientPhoneNumber: String
    $CINNumber: String
    $addressLine1: String
    $addressLine2: String
    $pincode: Float
    $area: String
    $city: String
    $state: String
    $societyLat: String
    $societyLong: String
    $status: String
  ) {
    updateSociety(
      input: {
        id: $id
        fields: {
          name: $name
          email: $email
          GSTState: $GSTState
          GSTNo: $GSTNo
          POCMobileNumber: $POCMobileNumber
          POCName: $POCName
          registeredEntityName: $registeredEntityName
          POCEmail: $POCEmail
          clientPhoneNumber: $clientPhoneNumber
          CINNumber: $CINNumber
          addressLine1: $addressLine1
          addressLine2: $addressLine2
          pincode: $pincode
          area: $area
          city: $city
          state: $state
          societyLat: $societyLat
          societyLong: $societyLong
          status: $status
        }
      }
    ) {
      society {
        id
        objectId
        displayId
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
        pincode
        area
        city
        state
        societyLat
        societyLong
        status
      }
    }
  }
`;