import { gql } from "@apollo/client";

export const GET_ORDER_REQUEST_BY_CART_ID = gql`
query getOrderRequests($cartId: String) {
  orderRequests(
    where: {cartId: { equalTo: $cartId}},
    order: createdAt_DESC
  ) {
    edges {
      node {
      objectId
        cartId
        status
        orderId
        firstLevelApproval {
          approver {
            email
            mobileNumber
            firstName
            lastName
          }
          createdAt
        }
        createdAt
        createdBy{
         firstName
         lastName
         email
        }
        secondLevelApproval {
          approver {
            email
            mobileNumber
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
}
`
export const GET_ORDER_REQUESTS = gql`
query getOrderRequests($mappingId: ID,$subQuery:OrderRequestWhereInput!) {
  orderRequests(
    where: { AND :[{ clientvendorcatalogMapping: {have: {objectId: {equalTo: $mappingId}}}},$subQuery]}
    order: createdAt_DESC
  ) {
    edges {
      node {
      objectId
        cartId
        status
        orderId
        firstLevelApproval {
          approver {
            email
            mobileNumber
            firstName
            lastName
          }
          createdAt
        }
        createdAt
        createdBy{
         firstName
         lastName
         email
        }
        secondLevelApproval {
          approver {
            email
            mobileNumber
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
}
`

export const CREATE_ORDER_REQUEST = gql`
   mutation createOrderRequest($cartId: String!,$clientvendorcatalogMappingId:ID) {
    createOrderRequest(input: { fields: {status:"Approval Pending", cartId: $cartId, clientvendorcatalogMapping: {link:$clientvendorcatalogMappingId}} }) {
      orderRequest {
        cartId
        firstLevelApproval {
          approver {
              firstName
              lastName
          }
          approved
          comments

        }
        status
        secondLevelApproval {
          approver {
              firstName
              lastName
          }
          approved
          comments
        }
      }
    }
  }
`
export const CREATE_ORDER_REQUEST_WITH_FIRST_LEVEL_APPROVAL = gql`
   mutation createOrderRequest($cartId: String!,$comments:String,$clientvendorcatalogMappingId:ID,$approver:ID) {
    createOrderRequest(input: { fields: {firstLevelApproval:{
      createAndLink :{
        approver: {
          link:$approver
        }
        comments: $comments
        approved:true
      }
    }, status:"Approval Pending", cartId: $cartId, clientvendorcatalogMapping: {link:$clientvendorcatalogMappingId}} }) {
      orderRequest {
        cartId
        firstLevelApproval {
          approver {
              firstName
              lastName
          }
          approved
          comments

        }
        status
        secondLevelApproval {
          approver {
              firstName
              lastName
          }
          approved
          comments
        }
      }
    }
  }
`

export const FIRST_LEVEL_APPROVAL = gql`
  mutation approveFirstLevel($id: ID!, $approver: ID,$comments:String,) {
    updateOrderRequest(input: { id: $id, fields: { firstLevelApproval:{
      createAndLink :{
        approver: {
          link:$approver
        }
        comments: $comments
        approved:true
      }
    }}}) {
      orderRequest {
        id
        objectId
        }
      }

  }
`;
export const SECOND_LEVEL_APPROVAL = gql`
  mutation approveSecondLevel($id: ID!, $approver: ID,$comments:String,$orderId:String) {
    updateOrderRequest(input: { id: $id, fields: { orderId:$orderId,status:"Approved", secondLevelApproval:{
      createAndLink :{
        approver: {
          link:$approver
        }
        comments: $comments
        approved:true
      }
    }}}) {
      orderRequest {
        id
        objectId
        }
      }

  }
`;
