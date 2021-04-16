import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button,
} from '@material-ui/core'
import useAllUser from '../../graphql/user/hooks/useAllUsers'
import bubbleSort from '../bubblesort'
import DeleteUserPopup from './DeleteUserPopup'
 
const NewUserForm = ({ setOpen, open }) => {
    const [user, setUser] = useState()
    const allUser = useAllUser()
    const [popupIsOpen, setPopupIsOpen] = React.useState(false)
    const [popp, setPopp] = useState(false)
 
    if (allUser.loading) return null
 
    const projectId = window.localStorage.getItem('projectId')
    const closePopup = () => setPopupIsOpen(false)
 
    const popup = async (user) => {
        setPopp(true)
        setPopupIsOpen(true)
        setUser(user)
    }
 
    const handleClose = () => {
        setOpen(false)
    }
 
    const users = allUser.data.allUsers.filter((user) => user.projectId === projectId && !user.userName.includes(' (Removed user)'))
    let deleteUsers = bubbleSort(users);
    const usersList = (users) => {
        deleteUsers = users;
        return (
            <div>
                <table><tbody>
                    {deleteUsers.map((user, index) => <tr key={index}>
                        <td onClick={() => popup(user)}><Button size="small" color="secondary" > {user.userName} </Button> </td></tr>)
                    }
                </tbody></table>
            </div>
        )
    }
 
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select removal user
                    </DialogContentText>
                    {usersList(deleteUsers)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
            {popp === true ? <DeleteUserPopup open={popupIsOpen} handleClose={closePopup} user={user} /> : <div></div>}
        </div>
    )
}
export default NewUserForm