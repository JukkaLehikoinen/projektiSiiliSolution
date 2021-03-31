import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Button,
} from '@material-ui/core'

import useDeleteUser from '../../graphql/user/hooks/useDeleteUser'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import bubbleSort from '../bubblesort'

const UserForm = ({ setOpen, open }) => {
    const userQuery = useAllUsers()
    const [deleteUser] = useDeleteUser()
    //const [name, setName] = useState('')

    const projectId = window.localStorage.getItem('projectId')

    if (userQuery.loading) return null

    const handleClose = () => {
        setOpen(false)
    }

    /* const handleSaveList = () => {
        
        setOpen(false)
    } */

    const handleDelete = (user) => {
        deleteUser({
            variables: {
                userName: user.label,
                id: user.value,
                projectId: projectId,
            },
        })
    }

    let userList = [];
    userQuery.data.allUsers.map((user) => {
        if (user.projectId === projectId) {
        userList.push(user)
        }
    });
    
    let alphabeticalOrder = bubbleSort(userList);
    const modifiedUserData = alphabeticalOrder.map((user) => {
        //if (user.userName )
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const newUserList = () => {
        return (
            <div>
                <table><tbody>
                    {
                        modifiedUserData.map((user, index) => <tr key={index}>
                            <td >{user.label} </td>
                            <Button onClick={()=> handleDelete(user)} color="secondary">Delete</Button>
                            </tr>)
                    }
                </tbody></table>
            </div>
        )
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Users</DialogTitle>
                <DialogContent>
                    {newUserList()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
                    {/* <Button disabled={!name.length} onClick={handleSave} color="primary" id="addUser">
                        Add
                    </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default UserForm
