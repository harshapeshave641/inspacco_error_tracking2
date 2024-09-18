import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query getTasks($serviceSubscriptionId: ID!) {
    serviceSubscription(id: $serviceSubscriptionId) {
      id
      objectId
      tasks(where: { status: { equalTo: "Active" } }) {
        edges {
          node {
            id
            objectId
            summary
            description
            rewardPoints
            frequency
            dayInWeek
            dayInMonth
            isVisible
          }
        }
      }
    }
  }
`;

export const GET_TASK_BY_SOCIETY = gql`
  query getVendorTasks($taskIds: [ID]!, $startDate: Date!, $endDate: Date!) {
    taskActivities(
      where: {
        taskDate: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
        task: { have: { objectId: { in: $taskIds } } }
      }
      order: createdAt_DESC
    ) {
      edges {
        node {
          id
          objectId
          taskDate
          comment
          updatedAt
          activityHistory {
            edges {
              node {
                createdBy {
                  firstName
                  lastName
                  profilePicture
                  objectId
                }
                action
                value
                updatedAt
              }
            }
          }
          task {
            rewardPoints
            objectId
            description
            summary
            frequency
            updatedAt
            category
            createdAt
            assignedTo {
              objectId
              firstName
              lastName
              mobileNumber
            }
            parentTask {
              objectId
            }
            startDate
            endDate
            parentId
            module
          }
          attachments {
            edges {
              node {
                parentId
                fileName
                name
                url
                updatedAt
              }
            }
          }
          createdBy {
            firstName
            lastName
            mobileNumber
          }
          taskStatus
        }
      }
    }
  }
`;

export const GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY = gql`
  query getTaskIdsBySocietyId($societyId: ID, $serviceSubscriptionId: ID) {
    serviceSubscriptions(
      where: {
        OR: [
          { society: { have: { objectId: { equalTo: $societyId } } } }
          { objectId: { equalTo: $serviceSubscriptionId } }
        ]
      }
    ) {
      edges {
        node {
          tasks {
            edges {
              node {
                objectId
              }
            }
          }
          service {
            objectId
            name
          }
          partner {
            objectId
            name
          }
          society {
            objectId
            name
          }
          objectId
        }
      }
    }
  }
`;

export const GET_TASKACTIVITY_BY_ID = gql`
  query getTaskActivity($id: ID!) {
    taskActivity(id: $id) {
      id
      objectId
      taskDate
      comment
      updatedAt
      activityHistory {
        edges {
          node {
            createdBy {
              firstName
              lastName
              profilePicture
              objectId
            }
            action
            value
            updatedAt
          }
        }
      }
      task {
        rewardPoints
        objectId
        description
        summary
        frequency
        updatedAt
        category
        createdAt
        assignedTo {
          objectId
          firstName
          lastName
          mobileNumber
        }
        parentTask {
          objectId
        }
        startDate
        endDate
        parentId
        module
      }
      attachments {
        edges {
          node {
            parentId
            fileName
            name
            url
            updatedAt
          }
        }
      }
      createdBy {
        firstName
        lastName
        mobileNumber
      }
      taskStatus
    }
  }
`;

export const GET_SOCIETY_TASKS = gql`
  query getInternalTasks($societyIds: [ID!]) {
    societies(where: { objectId: { in: $societyIds } }) {
      edges {
        node {
          tasks {
            edges {
              node {
                objectId
              }
            }
          }
          objectId
        }
      }
    }
  }
`;
export const GET_ASSIGNED_SOCIETY_TASKS = gql`
  query getInternalAssignedTasks($societyIds: [ID!],$assignedTo:ID) {
    societies(where: { objectId: { in: $societyIds } }) {
      edges {
        node {
          tasks (where:{assignedTo:{have:{objectId:{equalTo:$assignedTo}}}}){
            edges {
              node {
                objectId
              }
            }
          }
          objectId
        }
      }
    }
  }
`;

export const GET_SOCIETY_TASKS_BY_ASSIGNEES = gql`
  query getSocietyTasks($societyIds: [ID!], $assignedTo: ID) {
    societies(
      where: {
        objectId: { in: $societyIds }
        tasks: {
          have: { assignedTo: { have: { objectId: { equalTo: $assignedTo } } } }
        }
      }
    ) {
      edges {
        node {
          tasks {
            edges {
              node {
                objectId
              }
            }
          }
          objectId
        }
      }
    }
  }
`;
