import {
    useMutation,
} from '@apollo/client'
import { DELETE_USER } from '../userQueries'

const useDeleteUser = () => {
    const retVal = useMutation(DELETE_USER)
    return retVal
}

export default useDeleteUser
