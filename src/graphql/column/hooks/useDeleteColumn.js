import { useMutation } from '@apollo/client'
import { DELETE_COLUMN } from '../columnQueries'

const useDeleteColumn = (id) => {
    const retVal = useMutation(DELETE_COLUMN)
    return retVal
}

export default useDeleteColumn
