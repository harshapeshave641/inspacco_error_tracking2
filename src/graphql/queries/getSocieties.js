import { gql } from "@apollo/client";

export function getSocietyMemberSubquery(currentUserId, activeRole) {
  return {
    objectId: {
      inQueryKey: {
        key: "society.objectId",
        query: {
          className: "SocietyMember",
          where: {
            AND: [
              { member: { equalTo: currentUserId } },
              { type: { equalTo: activeRole } },
            ],
          },
        },
      },
    },
  };
}

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
          addressLine1
          addressLine2
          societyLat
          societyLong
          city
          area
          pincode
          state
          status
        }
      }
    }
  }
`;
