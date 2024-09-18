import { gql } from '@apollo/client';

//error causing query
export const FAULTY_QUERY = gql`
  query FaultyQuery {
    nonExistentField {
      id
      name
    }
  }
`;
