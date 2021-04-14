import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useDeleteUser from '../../graphql/user/hooks/useDeleteUser'


export default function DeleteUserPopup(props) {
    console.log("MOI")
    const { open, handleClose, user, index } = props
    const [deleteUser] = useDeleteUser()
    console.log(props.user.userName, index)

    // const handleSave = (index, user) => {
    //     // setOptions('OK')
    //     for (let i = 0; i < removingUsers.length; i++) {
            
    //         deleteUser({
    //             variables: {
    //                 id: removingUsers[i].id,
    //                 userName: removingUsers[i].userName,
    //             },
    //         })     
    //     }
    // }

    // const ok = () => {
    //     setOpen(false)
    // }
  

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete " + props.user.userName + " from this project?"} </DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" user={user} index={index} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
}