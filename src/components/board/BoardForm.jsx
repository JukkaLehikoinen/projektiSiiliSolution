import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import useDeleteBoard from "../../graphql/board/hooks/useDeleteBoard";
import allBoardsByProject from "../../graphql/project/hooks/useBoardsByProjectId";
import bubbleSort from "../bubblesort";
import { boardPageStyles } from "../../styles/styles";
import DeleteBoardPopup from './DeleteBoardPopup'

const NewBoardForm = ({ setOpen, open }) => {
  const [deleteBoard] = useDeleteBoard();
 
  const [board, setBoard] = useState()
  const allBoardById = allBoardsByProject(window.localStorage.getItem("projectId"));
  const [popupIsOpen, setPopupIsOpen] = React.useState(false)
  const [popp, setPopp] = useState(false)
  const closePopup = () => setPopupIsOpen(false)

  const popup = async (board) => {
    setPopp(true)
    setPopupIsOpen(true)
    setBoard(board)
}

  
  if (allBoardById.loading) return null;
  
  const handleClose = () => {
    setOpen(false)
}


  const handleSave = (id, board) => {
  /*   for (let i = 0; i < removingBoards.length; i++) {
      deleteBoard({
        variables: {
          id: removingBoards[i].id,
          name: removingBoards[i].name,
        },
      });
    } */
  };

  const ok = () => {
    setOpen(false);
  };

  const boards = allBoardById.data.boardsByProjectId
  let deleteBoards = boards;
  const boardsList = (boards) => {
    deleteBoards = boards;
    return (
      <div>
        <table>
          <tbody>
            {deleteBoards.map((board, index) => (
                  <tr key={index}>
                     <td onClick={() => popup(board)}><Button size="small" color="secondary" ></Button> {board.name}{" "}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select removal board
          </DialogContentText>
          {boardsList(deleteBoards)}
          </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
            {popp === true ? <DeleteBoardPopup open={popupIsOpen} handleClose={closePopup} board={board}  /> : <div></div>}
        </div>

  );
};
export default NewBoardForm;
