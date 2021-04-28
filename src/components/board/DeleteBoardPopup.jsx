import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useDeleteBoard from "../../graphql/board/hooks/useDeleteBoard";

export default function DeleteUserPopup(props) {
  const { open, handleClose, board } = props;
  const [deleteBoard] = useDeleteBoard();

  const handleSave = async () => {
    await deleteBoard({
      variables: {
        id: board.id,
        name: board.name,
        projectId: window.localStorage.getItem("projectId"),
      },
    });
    window.location.reload(false);
    handleClose();
  };

  let message;
  if (props.board.count < 1) {
    message = "This board has 0 tickets";
  } else if (props.board.count == 1) {
    message = "This board has 1 ticket";
  } else {
    message = `There are ${props.board.ticketCount} tickets in this board.`;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`${message} Do you want to remove ${props.board.name} from this project?`}{" "}
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
