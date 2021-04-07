import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button,
} from '@material-ui/core'
import useDeleteUser from '../../graphql/user/hooks/useDeleteUser'
import useAllUser from '../../graphql/user/hooks/useAllUsers'

const NewUserForm = ({ setOpen, open }) => {
    const [deleteUser] = useDeleteUser()
    const allUser = useAllUser()
    const [removingUsers, setRemovingUsers] = useState([])
    const [options, setOptions] = useState('SAVE')
    const [del, setDel] = useState([])
    
    if (allUser.loading) return null
    
    const projectId = window.localStorage.getItem('projectId')

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = (id, user) => {
        setOptions('OK')
        for (let i = 0; i < removingUsers.length; i++) {
            
            deleteUser({
                variables: {
                    id: removingUsers[i].id,
                    userName: removingUsers[i].userName,
                },
            })     
        }
        // setOpen(false)
    }

    const ok = () => {
        setOpen(false)
    }

    
    
    const users = allUser.data.allUsers.filter((user) => user.projectId === projectId && !user.userName.includes(' (Removed user)')) 
    let deleteUsers = users;
    const usersList = (users) => {
        deleteUsers = users;
        return (
            <div>
                 <table><tbody>
                {   removingUsers.length > 0 ? del.map((user, index) => <tr key={index}>
                            <td onClick={()=>deleteUserFunction(user, index)}>{user.userName} </td></tr>) : 
                        (deleteUsers.map((user, index) => <tr key={index}>
                            <td onClick={()=>deleteUserFunction(user, index)}>{user.userName} </td></tr>))
                    }
                </tbody></table>
            </div>
        )        
    }
    const deleteUserFunction = async (user, index)=>{
        let delName = removingUsers.filter((uzer) => uzer.id === user.id)
        if (delName.length === 0) {
            removingUsers.push(user)
        }      
        setDel(await deleteUsers.filter((user, i)=> index !== i))
    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    {options === 'SAVE' ? 'Select removal user' : ('Remaining users')}    
                    </DialogContentText>
                    { removingUsers.length > 0 ? usersList(del) : (usersList(users)) }
                </DialogContent>
                <DialogActions>
                    {options === 'SAVE' ? <Button onClick={handleClose} color="primary">CANCEL</Button> : (<p></p>)}
                    {options === 'SAVE' ? <Button onClick={handleSave} color="primary">SAVE</Button> : (<Button onClick={ok} color="primary">OK</Button>)}
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default NewUserForm