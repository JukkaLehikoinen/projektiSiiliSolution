import { gql } from '@apollo/client'

export const PROJECT_BY_ID = gql`
    query projectById($projectId: ID!) {
        projectById(id: $projectId) {
            id
            name
            boards {
                id
                name
                orderNumber
            }
        }
    }
`
export const ARCHIVE_PROJECT_FROM_PROJECT_DELETION = gql`
    mutation archiveProjectFromProjectDeletion($id: ID!) {
      archiveProjectFromProjectDeletion(id: $id)
    }
`

export const PROJECT_REMOVED = gql`
  subscription projectRemoved($id: ID!, $eventId: ID!) {
    boardRemoved(id: $id, eventId: $eventId) {
      removeType
      removeInfo {
        id
      }
    }
  }
`;

export const ARCHIVE_PROJECT = gql`
  mutation archiveProject($id: ID!, $eventId: ID!) {
    archiveProjectById(id: $id, eventId: $eventId)
  }
`;




export const BOARDS_BY_PROJECT_ID = gql`
    query boardsByProjectId($projectId: ID!) {
        boardsByProjectId(id: $projectId) {
            id
            name
            orderNumber
        }   
    }
`
export const ALL_PROJECTS = gql`
    query {
        allProjects {
            id
            name
            orderNumber
        }
    }
`
export const ADD_PROJECT = gql`
    mutation addProject($name: String!) {
        addProject(name: $name) {
            id
            name
        }
    }
`

export const PROJECT_ADDED = gql`
  subscription projectAdded($projectId: ID!, $eventId: ID!) {
    projectAdded(projectId: $projectId, eventId: $eventId) {
      mutationType
      project {
        id
        name
        orderNumber
      }
    }
  }
`;

