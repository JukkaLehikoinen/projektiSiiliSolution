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
    mutation addUser($userName: String!) {
        addUser(userName: $userName) {
            id
            userName
            projectId
        }
    }
`
