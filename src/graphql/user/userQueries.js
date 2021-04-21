/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const ALL_USERS = gql`
    query {
        allUsers {
            id
            userName
            projectId
        }
    }
`
export const ADD_USER = gql`
    mutation addUser($userName: String!, $projectId: String!) {
        addUser(userName: $userName, projectId: $projectId) {
            id
            userName
            projectId
        }
    }
`
export const DELETE_USER = gql`
    mutation deleteUser($id: String! $userName: String!) {
        deleteUser(id: $id, userName: $userName) {
            id
            userName
        }
    }
`
