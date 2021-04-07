/* eslint-disable object-curly-newline */
import React, { useState } from "react";
import {
  Dialog,
  Grid,
  Button,
  TextField,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import Select from "react-select";
import { useApolloClient } from "@apollo/client";
import { boardPageStyles } from "../../styles/styles";
import "../../styles.css";
import useAddSubtask from "../../graphql/subtask/hooks/useAddSubtask";
import useAllUsers from "../../graphql/user/hooks/useAllUsers";
import {
  TICKETORDER,
  BOARDS_COLUMNS_AND_COLUMNORDER,
} from "../../graphql/fragments";
import useAllColors from "../../graphql/task/hooks/useAllColors";
import bubbleSort from "../bubblesort";
import colourStyles from '../SelectDialogColors'
import colorboardqueries from '../../graphql/colorboards/hooks/useAddEpicColor'
import allEpicColors from '../../graphql/colorboards/hooks/useAllEpicColors'

const AddSubtaskDialog = ({
  addDialogStatus,
  toggleAddDialog,
  columnId,
  taskId,
  boardId,
}) => {
  const EpicColorQuery = allEpicColors()
  const [addEpicColor] = colorboardqueries();
  const userQuery = useAllUsers();
  const colorQuery = useAllColors();
  const classes = boardPageStyles();
  const [addSubtask] = useAddSubtask();
  const client = useApolloClient();
  const [name, setName] = useState("");
  const [size, setSize] = useState(null);
  const [content, setContent] = useState("");
  const [owner, setOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [colors, setColors] = useState([]);
  const [inputColumnId, setInputColumnId] = useState(null);
  const [options, setOptions] = useState('Rename Colors')
  const [EpicColors, setEpicColors] = useState()
  let changedColors = [];

  const { columns, columnOrder } = client.cache.readFragment({
    id: `Board:${boardId}`,
    fragment: BOARDS_COLUMNS_AND_COLUMNORDER,
  });
  if (userQuery.loading || colorQuery.loading || EpicColorQuery.loading) return null

  const columnOfParentTask = columns.find((col) => col.id === columnId)?.name;

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSizeChange = (event) => {
    if (event.target.value === "") {
      setSize(null);
      return;
    }
    setSize(parseFloat(event.target.value));
  };

  const handleOwnerChange = (action) => {
    setOwner(action.value);
  };

  const handleMembersChange = (event) => {
    setMembers(Array.isArray(event) ? event.map((user) => user.value) : []);
  };

  const handleColorsChange = (event) => {
    setColors(Array.isArray(event) ? event.map((user) => user.value) : []);
  };

  const handleColumnChange = (action) => {
    setInputColumnId(action.value);
  };

  const emptyState = () => {
    setName("");
    setContent("");
    setSize(null);
    setOwner(null);
    setInputColumnId(null);
    setMembers([]);
    setColors([]);
  };

  const renameColors = () => {
    if (options === 'Rename Colors') {
        setOptions('Save changes')
    } else {
        setEpicColors(changedColors)
        for (let i = 0; i < changedColors.length; i++) {
            addEpicColor({
                variables: {
                    colorId:changedColors[i].id,
                    boardId: boardId,
                    name: changedColors[i].name,
                }
            })
        }

        setOptions('Rename Colors')
    }
}

const inputChanged = (event) => {
    changedColors[event.target.id].name = event.target.value
  }

const colorList = () => {
    if (EpicColors) {
        changedColors = EpicColors
    }

    return (
        <div>
            <table><tbody>
                {
                    changedColors.map((color, index) => <tr key={index}>
                        <td style={{ height:'20px', width:'20px', backgroundColor: color.color }}></td>
                        <td><input name={color.color} id={index} onChange={inputChanged} defaultValue={color.name}></input></td></tr>)
                }
            </tbody></table>
        </div>
    )
}

  const handleSave = (event) => {
    event.preventDefault();
    // Get the ticketOrder of the column to which user is creating the subtask
    const { ticketOrder } = client.cache.readFragment({
      id: `Column:${inputColumnId || columnId}`,
      fragment: TICKETORDER,
    });
    const ticketOrderWithoutTypename = ticketOrder.map((obj) => ({
      ticketId: obj.ticketId,
      type: obj.type,
    }));
    const eventId = window.localStorage.getItem("eventId");
    addSubtask({
      variables: {
        columnId: inputColumnId || columnId,
        taskId,
        boardId,
        ownerId: owner,
        memberIds: members,
        colorIds: colors,
        name,
        content,
        size,
        ticketOrder: ticketOrderWithoutTypename,
        eventId,
      },
    });
    emptyState();
    toggleAddDialog(event);
  };

  const handleCancel = (e) => {
    emptyState();
    toggleAddDialog(e);
  };

    const projectId = window.localStorage.getItem('projectId')
    let userList = [];
    userQuery.data.allUsers.map((user) => {
        if (user.projectId === projectId) {
        userList.push(user)
        }
    });

  let alphabeticalOrder = bubbleSort(userList);
  const modifiedUserData = alphabeticalOrder.map((user) => {
    const newObject = { value: user.id, label: user.userName };
    return newObject;
  });


  const colorNamesToList = (color) => {
    if (EpicColorQuery.data.allEpicColors.filter((epic) => epic.boardId === boardId).length > 0) {
    const epicBoard = EpicColorQuery.data.allEpicColors.filter((epic) => epic.colorId === color.id);
    const epics = epicBoard.filter((epic) => epic.boardId === boardId);
    if (epics.length > 0) {
    return epics[0].name;
    } else {
        return color.color
    }
    } else {
        return color.color;
    }
}

const addColorsToChangedColors = () => {
    const modifiedColorData = colorQuery.data.allColors.map((color) => {
        changedColors.push({id: color.id, color: color.color, name: colorNamesToList(color)});
    })
}

addColorsToChangedColors();
if (EpicColors) {
    changedColors=EpicColors;
}
  const modifiedColorData = colorQuery.data.allColors.map((color) => {
    const newObject = {
      value: color.id,
      label:
          color.color.charAt(0).toUpperCase() +
          color.color.slice(1) +
          <Button></Button>,
    };
    return newObject;
  });

  const columnsData = columnOrder
    .map((id) => columns.find((col) => col.id === id))
    .map((col) => {
      const newObject = { value: col.id, label: col.name };
      return newObject;
    });

  return (
    <Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        onClose={handleCancel}
        open={addDialogStatus}
        aria-labelledby="max-width-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle aria-labelledby="max-width-dialog-title">
          Create new subtask
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            autoComplete="off"
            margin="dense"
            name="name"
            label="Name"
            type="text"
            value={name}
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            autoComplete="off"
            margin="dense"
            name="content"
            label="Content"
            type="text"
            value={content}
            fullWidth
            onChange={handleContentChange}
          />
          <TextField
            autoComplete="off"
            margin="dense"
            name="size"
            label="Size"
            type="text"
            value={size || ""}
            fullWidth
            onChange={handleSizeChange}
          />
          <Select
            isMulti
            className="selectField"
            placeholder="Select colors"
            options={modifiedColorData}
            onChange={handleColorsChange}
            closeMenuOnSelect={false}
            styles={colourStyles}
          />
          <Select
            className="selectField"
            placeholder="Select owner"
            options={modifiedUserData}
            onChange={handleOwnerChange}
          />
          <Select
            isMulti
            className="selectField"
            placeholder="Select members"
            options={modifiedUserData}
            onChange={handleMembersChange}
            closeMenuOnSelect={false}
          />
          <Select
            className="selectField"
            placeholder={`Select column - ${columnOfParentTask}`}
            options={columnsData}
            onChange={handleColumnChange}
          />
        </DialogContent>
        {options === 'Save changes' ? (<div> {colorList()}</div>) : (<div></div>)}
        <DialogActions>
          <Button onClick={(e) => handleCancel(e)} color="secondary">
            Cancel
          </Button>
          <Button
                        onClick={() => renameColors()}
                        color="default"
                        id="changeColors"
                    >
                        {options}
                    </Button>
          <Button disabled={!name.length} onClick={handleSave} color="primary">
            Create subtask
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default AddSubtaskDialog;
