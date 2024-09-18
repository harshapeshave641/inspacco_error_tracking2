import { gql } from "@apollo/client";

export const GET_USER_SETTINGS = gql`
 query getUserSettings($userId: ID!,$settingType:String){
  userSettings(where: {
    user: {
      have: {
        objectId: {
          equalTo: $userId
        }
      }
    }
    settingType : {
      equalTo: $settingType
    },
  }) {
    edges {
      node {
        objectId
        settingType
        key
        value
      }
    }
  }
}`;
export const CREATE_USER_SETTINGS = gql`
 mutation createUserSetting($userId:ID,$settingType:String,$key:String!,$value:String!){
    createUserSetting(input:{fields:{user:{link:$userId},settingType:$settingType,key:$key,value:$value}}){
      userSetting{
        settingType
        key
        value
      }
    }
  }
`
export const UPDATE_USER_SETTING = gql`
mutation updateUserSetting($id: ID!,$value:String) {
    updateUserSetting(input: { id: $id, fields: { value: $value } }) {
      userSetting {
        id
        objectId
        settingType
        key
        value
      }
    }
  }
`;

