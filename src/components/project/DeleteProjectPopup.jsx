import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useArchiveProject from "../../graphql/project/hooks/useArchiveProject";
import { removeProjectFromCache } from '../../cacheService/cacheUpdates'

export default function DeleteProjectPopup(props) {
  const { open, handleClose, project } = props;
  const [deleteProject] = useArchiveProject();
  const eventId = window.localStorage.getItem('eventId')
  const handleSave = () => {
    deleteProject({
      variables: {
        projectId: project.id,
        eventId: eventId,
      },
    });
    removeProjectFromCache(project.id);
    handleClose();
  };

 /*  let message;
  if (props.board.ticketCount == null) {
    message = "This board has 0 tickets.";
  } else if (props.board.ticketCount === 1) {
    message = "This board has 1 ticket.";
  } else {
    message = `There are ${props.board.ticketCount} tickets in this board.`;
  } */

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
       {/*  {`${message} Do you want to remove ${props.board.name} from this project?`}{" "} */}
       {project.name}
      </DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleSave} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
