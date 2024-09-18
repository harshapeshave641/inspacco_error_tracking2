import { gql } from '@apollo/client';
export const CREATE_SCHEDULE_VISIT_COMMENT = gql`
  mutation createScheduleVisitComment($comment: String!) {
    createScheduleVisitComment(input: { fields: { comment: $comment } }) {
      scheduleVisitComment {
        id
        objectId
      }
    }
  }
`;
