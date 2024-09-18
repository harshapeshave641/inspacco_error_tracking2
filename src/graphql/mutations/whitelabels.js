import { gql } from "@apollo/client";
export const ADD_WHITE_LABEL = gql`
  mutation addLabel($label: String!, $value: String!) {
    createWhiteLabel(input: { fields: { label: $label, value: $value } }) {
      whiteLabel {
        label
        value
      }
    }
  }
`;

export const UPDATE_WHITE_LABEL = gql`
  mutation addLabel($label: String!, $value: String!) {
    createWhiteLabel(input: { fields: { label: $label, value: $value } }) {
      whiteLabel {
        label
        value
      }
    }
  }
`;
