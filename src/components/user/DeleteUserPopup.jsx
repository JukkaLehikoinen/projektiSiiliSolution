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
    const { open, handleClose, user } = props
    const [deleteUser] = useDeleteUser()
    console.log(props.user.userName)

     const handleSave = () => {
       
            
           deleteUser({
               variables: {
                    id: user.id,
                     userName: user.userName,
                 },
            })    

    
       handleClose()
    }
  

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
          <Button onClick={handleSave} color="primary"  autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
  }