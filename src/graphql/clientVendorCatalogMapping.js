import { gql } from "@apollo/client";


export const GET_CLIENT_VENDOR_CATALOG_MAPPINGS = gql`
query getClientVendorCatalogMappings($societyId:ID){
  clientVendorCatalogMappings(where:{
    society:{
      have:{
        objectId:{
          equalTo:$societyId
        }
      }
    },
    partner:{
      have:{
        ecommerceEnabled:{
          equalTo:true
        }
      }
    }
  }){
    edges{
      node{
        objectId
        partner{
          ecommerceEnabled
          name
          objectId
          ecommerceSetting
        }
        approvalRequired
      }
    }
  }
}
`