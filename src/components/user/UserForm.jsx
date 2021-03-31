import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Button,
} from '@material-ui/core'
import useAddUser from '../../graphql/user/hooks/useAddUser'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import bubbleSort from '../bubblesort'

const UserForm = ({ setOpen, open }) => {
    const userQuery = useAllUsers()
    const [addUser] = useAddUser()
    const [name, setName] = useState('')
    const handleChange = (event) => {
        setName(event.target.value)
    }
    const projectId = window.localStorage.getItem('projectId')

    if (userQuery.loading) return null

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        addUser({
            variables: {
                userName: name,
                projectId: projectId,
            },
        })
        setName('')
        setOpen(false)
    }

    let userList = [];
    userQuery.data.allUsers.map((user) => {
        if (user.projectId === projectId) {
        userList.push(user)
        }
    });
    console.log(userList);
    
    let alphabeticalOrder = bubbleSort(userList);
    const modifiedUserData = alphabeticalOrder.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })
    console.log(modifiedUserData);

    const newUserList = () => {

        return (
            <div>
                <table><tbody>
                    {
                        modifiedUserData.map((user, index) => <tr key={index}>
                            <td >{user.label}</td>
                            </tr>)
                    }
                </tbody></table>
            </div>
        )
    }
    console.log(newUserList);


    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Users</DialogTitle>
                <DialogContent>
                {newUserList()}
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!name.length} onClick={handleSave} color="primary" id="addUser">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default UserForm
