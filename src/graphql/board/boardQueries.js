import { gql } from "@apollo/client";

export const BOARD_BY_ID = gql`
  query boardById($boardId: ID!) {
    boardById(id: $boardId) {
      id
      prettyId
      name
      columnOrder
      swimlaneOrder
      ticketCount
      columns {
        id
        name
        ticketOrder {
          ticketId
          type
        }
        board {
          id
          columnOrder
        }
        tasks {
          id
          prettyId
          title
          size
          colors {
            id
            color
          }
          owner {
            id
            userName
          }
          members {
            id
            userName
          }
          description
          swimlaneOrderNumber
          column {
            id
          }
          board {
            id
          }
        }
        subtasks {
          id
          prettyId
          name
          content
          size
          column {
            id
          }
          owner {
            id
            userName
          }
          task {
            id
            prettyId
            title
          }
          members {
            id
            userName
          }
          colors {
            id
            color
          }
          board {
            id
          }
        }
      }
    }
  }
`;
export const ADD_BOARD = gql`
  mutation addBoard(
    $name: String!
    $prettyId: String!
    $eventId: ID!
    $projectId: ID!
  ) {
    addBoard(
      name: $name
      prettyId: $prettyId
      eventId: $eventId
      projectId: $projectId
    ) {
      id
      name
      prettyId
    }
  }
`;
export const BOARD_ADDED = gql`
  subscription boardAdded($projectId: ID!, $eventId: ID!) {
    boardAdded(projectId: $projectId, eventId: $eventId) {
      mutationType
      board {
        id
        name
        orderNumber
        prettyId
      }
    }
  }
`;
export const DELETE_BOARD = gql`
  mutation deleteBoard($id: ID!, $name: String!) {
    deleteBoard(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const ALL_BOARDS = gql`
  query {
    allBoards {
      id
      name
    }
  }
`;

export const ARCHIVE_BOARD_FROM_PROJECT_DELETION = gql`
    mutation archiveBoardFromProjectDeletion($id: ID!) {
      archiveBoardFromProjectDeletion(id: $id)
    }
`
