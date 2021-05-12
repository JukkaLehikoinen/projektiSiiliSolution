import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useArchiveProject from "../../graphql/project/hooks/useArchiveProject";
import useProjectById from '../../graphql/project/hooks/useProjectById'
import { removeProjectFromCache } from '../../cacheService/cacheUpdates'

export default function DeleteProjectPopup(props) {
  const { open, handleClose, project } = props;
  const [deleteProject] = useArchiveProject();
  const queryResult = useProjectById(project.id);
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

  if (queryResult.loading) return null
  let index = 0;

  queryResult.data.projectById.boards.map(() => {
    index +=1
  })

  let message;
  if (queryResult.data.projectById === null) {
    message = "This project has 0 boards.";
  } else if (queryResult.data.projectById === 1) {
    message = "This project has 1 board.";
  } else {
    message = `There are ${index} boards in this project.`;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`${message} Do you want to remove ${project.name} from this project?`}{" "}
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
