import React, { useState } from 'react'
import {
    Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core'
import Select from 'react-select'
import {
    sizeSchema, titleSchema, descriptionSchema, taskSchema,
} from './validationSchema'
import { boardPageStyles } from '../../styles/styles'
import '../../styles.css'
import useAddTask from '../../graphql/task/hooks/useAddTask'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import useAllColors from '../../graphql/task/hooks/useAllColors'
import bubbleSort from '../bubblesort'
import colourStyles from '../SelectDialogColors'
import colorboardqueries from '../../graphql/colorboards/hooks/useAddEpicColor'
import allEpicColors from '../../graphql/colorboards/hooks/useAllEpicColors'

const AddTaskDialog = ({
    dialogStatus, column, toggleDialog, boardId,
}) => {
    const EpicColorQuery = allEpicColors()
    const [addEpicColor] = colorboardqueries();
    const userQuery = useAllUsers()
    const colorQuery = useAllColors()
    const [addTask] = useAddTask(column?.id)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState(null)
    const [size, setSize] = useState(null)
    const [owner, setOwner] = useState(null)
    const classes = boardPageStyles()
    const [members, setMembers] = useState([])
    const [colors, setColors] = useState([])
    const [sizeError, setSizeError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [options, setOptions] = useState('Rename Colors')
    const [EpicColors, setEpicColors] = useState()
    let changedColors = [];

    if (userQuery.loading || colorQuery.loading || EpicColorQuery.loading) return null

    const handleTitleChange = (event) => {
        const input = event.target.value
        titleSchema.validate(input).catch((err) => {
            setTitleError(err.message)
        })
        setTitleError('')
        setTitle(input)
    }

    const handleSizeChange = (event) => {
        const input = parseInt(event.target.value, 10)
        if (input === '') {
            setSize(null)
            return
        }
        sizeSchema.validate(input).catch((err) => {
            setSizeError(err.message)
        })
        setSize(input)
        setSizeError('')
    }

    const handleOwnerChange = (action) => {
        setOwner(action.value)
    }

    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const handleColorsChange = (event) => {
        setColors(Array.isArray(event) ? event.map((color) => color.value) : [])
    }

    const handleDescriptionChange = (event) => {
        const input = event.target.value
        if (input === '') {
            setDescription(null)
            return
        }

        descriptionSchema.validate(input).catch((err) => {
            setSizeError(err.message)
        })
        setDescriptionError('')
        setDescription(input)
    }

    const emptyState = () => {
        setTitle('')
        setSize(null)
        setOwner(null)
        setMembers([])
        setColors([])
        setDescription(null)
    }

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

    const handleSave = async (event) => {
        event.preventDefault()
        const eventId = window.localStorage.getItem('eventId')
        const isValid = await taskSchema.isValid({ title, size, description })
        if (isValid) {
            addTask({
                variables: {
                    boardId,
                    columnId: column.id,
                    title,
                    size,
                    ownerId: owner,
                    memberIds: members,
                    colorIds: colors,
                    description,
                    eventId,
                },
            })
            emptyState()
            toggleDialog()
        }
    }

    const handleCancel = () => {
        emptyState()
        toggleDialog()
    }

    const projectId = window.localStorage.getItem('projectId')
    let userList = [];
    userQuery.data.allUsers.filter((user) => !user.userName.includes(' (Removed user)')).map((user) => {
        if (user.projectId === projectId) {
        userList.push(user)
        }
        return userList
    });

    let alphabeticalOrder = bubbleSort(userList);
    const modifiedUserData = alphabeticalOrder.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

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
        colorQuery.data.allColors.map((color) => {
            changedColors.push({id: color.id, color: color.color, name: colorNamesToList(color)});
            return changedColors
        })
    }

    addColorsToChangedColors();
    if (EpicColors) {
        changedColors=EpicColors;
    }
    const modifiedColorData = changedColors.map((color) => {
        const newObject = { value: color.id, color: color.color, label: color.name.charAt(0).toUpperCase() + color.name.slice(1) }
        return newObject
    })

    const isDisabled = () => {
        if (!title.length
            || sizeError.length > 0
            || titleError.length > 0
            || descriptionError.length > 0) {
            return true
        }
        return false
    }

    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                onClose={toggleDialog}
                open={dialogStatus}
                aria-labelledby="max-width-dialog-title"
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogTitle aria-labelledby="max-width-dialog-title">Create new task</DialogTitle>
                <DialogContent>
                    <TextField
                        error={titleError.length > 0}
                        id="filled-error-helper-text, inputTaskName"
                        autoComplete="off"
                        autoFocus={true}
                        required={true}
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        value={title}
                        fullWidth
                        helperText={titleError}
                        onChange={handleTitleChange}
                    />
                    <TextField
                        error={sizeError.length > 0}
                        id="filled-error-helper-text"
                        autoComplete="off"
                        margin="dense"
                        name="size"
                        label="Size"
                        type="number"
                        value={size || ''}
                        fullWidth
                        helperText={sizeError}
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
                        id="taskSelectOwner"
                    />
                    <Select
                        isMulti
                        className="selectField"
                        placeholder="Select members"
                        options={modifiedUserData}
                        onChange={handleMembersChange}
                        closeMenuOnSelect={false}
                    />
                    <TextField
                        error={descriptionError.length > 0}
                        id="standard-multiline-static, filled-error-helper-text"
                        autoComplete="off"
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        helperText={descriptionError}
                        multiline
                        rows={3}
                        value={description || ''}
                        fullWidth
                        onChange={handleDescriptionChange}
                    />
                </DialogContent>
                <DialogContent>
                    {options === 'Save changes' ? (<div> {colorList()}</div>) : (<div></div>)}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancel}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => renameColors()}
                        color="default"
                        id="changeColors"
                    >
                        {options}
                    </Button>
                    <Button
                        disabled={isDisabled()}
                        onClick={handleSave}
                        color="primary"
                        id="createTaskButton"
                    >
                        Create task
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default AddTaskDialog
