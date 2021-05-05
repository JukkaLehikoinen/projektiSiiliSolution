import { useMutation } from '@apollo/client'
import { ADD_PROJECT } from '../projectQueries'
import { getAllProjects } from '../../../cacheService/cacheUpdates'

const useAddProject = () => {
    const retVal = useMutation(ADD_PROJECT, {
        update: async (cache, response) => {
            getAllProjects(response.data.addProject)
        }
    })
    return retVal
}
export default useAddProject