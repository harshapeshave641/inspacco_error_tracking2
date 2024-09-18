import { gql } from "@apollo/client";

export const GET_RECENT_TASK_ACTIVITIES = gql`
  query getRecentTaskActivities(
    $taskIds: [ID]!
    $count: Int = 50
    $status: [String] = ["OPEN", "IN_PROGRESS", "COMPLETED"]
    $term: String = ""
  ) {
    taskActivities(
      where: {
        taskStatus: { in: $status }
        task: {
          have: {
            objectId: { in: $taskIds }
            frequency: { equalTo: "ONCE" }
            summary: { matchesRegex: $term, options: "i" }
          }
        }
      }
      first: $count
      order: taskDate_DESC
    ) {
      edges {
        node {
          id
          objectId
          taskDate
          taskStatus
          task {
            id
            objectId
            summary
            module
            parentId
            createdBy {
              id
              objectId
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;

export const GET_RECENT_TASK_ACTIVITIES_BY_DATE = gql`
  query getRecentInternalTaskActivities(
    $taskIds: [ID]!
    $count: Int = 50
    $status: [String] = ["OPEN", "IN_PROGRESS", "COMPLETED"]
    $term: String = ""
    $startDate: Date!
    $endDate: Date!
  ) {
    taskActivities(
      where: {
        taskStatus: { in: $status }
        taskDate: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        task: {
          have: {
            objectId: { in: $taskIds }
            frequency: { equalTo: "ONCE" }
            summary: { matchesRegex: $term, options: "i" }
          }
        }
      }
      first: $count
      order: taskDate_DESC
    ) {
      edges {
        node {
          id
          objectId
          taskDate
          taskStatus
          task {
            id
            objectId
            summary
            module
            parentId
            createdBy {
              id
              objectId
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;
export const GET_SOCIETY_TASKS_BY_DATE_RANGE = gql`
  query getSocietyTasks($societyId: ID!, $startDate: Date!, $endDate: Date!) {
    taskActivities(
      where: {
        taskDate: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        serviceSubscription: {
          have: { society: { have: { objectId: { equalTo: $societyId } } } }
        }
      }
    ) {
      edges {
        node {
          id
          objectId
          taskDate
          taskStatus
          createdAt
          updatedAt
          task {
            description
          }
          attachments {
            edges {
              node {
                parentId
              }
            }
          }
          createdBy {
            firstName
            lastName
            mobileNumber
          }
          serviceSubscription {
            objectId
            service {
              name
            }
            society {
              objectId
              name
            }
          }
        }
      }
    }
  }
`;
