import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation createFile($file: Upload!) {
    createFile(input: { upload: $file }) {
      fileInfo {
        name
        url
      }
    }
  }
`;
export const UPLOAD_FILE_MUTATION_STRING = `
mutation createFile($file: Upload!) {
  createFile(input: { upload: $file }) {
    fileInfo {
      name
      url
    }
  }
}
`;