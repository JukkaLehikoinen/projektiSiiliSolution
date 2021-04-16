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
import useAllBoards from "../../graphql/board/hooks/useAllBoards";
import bubbleSort from "../bubblesort";
import { boardPageStyles } from "../../styles/styles";

const NewBoardForm = ({ setOpen, open }) => {
  const [deleteBoard] = useDeleteBoard();
  const allBoards = useAllBoards();
  const removingBoards = useState([]);
  const [options, setOptions] = useState("SAVE");
  const [del, setDel] = useState([]);

  if (allBoards.loading) return null;

  const projectId = window.localStorage.getItem("projectId");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (id, board) => {
    setOptions("OK");
    for (let i = 0; i < removingBoards.length; i++) {
      deleteBoard({
        variables: {
          id: removingBoards[i].id,
          name: removingBoards[i].name,
        },
      });
    }
  };

  const ok = () => {
    setOpen(false);
  };

  const boards = allBoards.data.allBoards.filter(
    (board) => board.projectId === projectId
  );
  let deleteBoards = bubbleSort(boards);
  const boardsList = (boards) => {
    deleteBoards = boards;
    return (
      <div>
        <table>
          <tbody>
            {removingBoards.length > 0
              ? del.map((board, index) => (
                  <tr key={index}>
                    <td onClick={() => deleteBoardFunction(board, index)}>
                      {board.name}{" "}
                    </td>
                  </tr>
                ))
              : deleteBoards.map((board, index) => (
                  <tr key={index}>
                    <td onClick={() => deleteBoardFunction(board, index)}>
                      {board.name}{" "}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  };
  const deleteBoardFunction = async (board, index) => {
    let delName = removingBoards.filter((uzer) => uzer.id === board.id);
    if (delName.length === 0) {
      removingBoards.push(board);
    }
    setDel(await deleteBoards.filter((board, i) => index !== i));
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
            {options === "SAVE" ? "Select removal board" : "Remaining boards"}
          </DialogContentText>
          {removingBoards.length > 0
            ? boardsList(del)
            : boardsList(deleteBoards)}
        </DialogContent>
        <DialogActions>
          {options === "SAVE" ? (
            <Button onClick={handleClose} color="primary">
              CANCEL
            </Button>
          ) : (
            <p></p>
          )}
          {options === "SAVE" ? (
            <Button onClick={handleSave} color="primary">
              SAVE
            </Button>
          ) : (
            <Button onClick={ok} color="primary">
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default NewBoardForm;
