import React, { useState, useEffect } from 'react'
import {
    Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import useEditSubtask from '../../graphql/subtask/hooks/useEditSubtask'
import { boardPageStyles } from '../../styles/styles'
import useAllColors from '../../graphql/task/hooks/useAllColors'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import bubbleSort from '../bubblesort'
import colourStyles from '../SelectDialogColors'
import colorboardqueries from '../../graphql/colorboards/hooks/useAddEpicColor'
import allEpicColors from '../../graphql/colorboards/hooks/useAllEpicColors'

const EditSubtaskDialog = ({
    dialogStatus, editId, toggleDialog, subtask
}) => {
    const EpicColorQuery = allEpicColors()
    const [addEpicColor] = colorboardqueries();
    const [editSubtask] = useEditSubtask()
    const userQuery = useAllUsers()
    const colorQuery = useAllColors()
    const [name, setName] = useState()
    const [size, setSize] = useState()
    const [content, setContent] = useState(subtask.content)
    const [owner, setOwner] = useState()
    const arrayOfOldMemberIds = subtask.members.map((user) => user.id)
    const arrayOfOldColorIds = subtask?.colors?.map((color) => color.id)
    const [members, setMembers] = useState()
    const [colors, setColors] = useState()
    const animatedComponents = makeAnimated()
    const classes = boardPageStyles()
    const [options, setOptions] = useState('Rename Colors')
    const [EpicColors, setEpicColors] = useState()
    let changedColors = [];
    const boardId = subtask.board.id    
    
    useEffect(() => {
        setName(subtask.name)
        setSize(subtask.size)
        setContent(subtask.content)
        setOwner(subtask.owner ? subtask.owner.id : null)
        setMembers(subtask.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(subtask.colors.length > 0 ? arrayOfOldColorIds : [])
    }, [subtask])

    if (userQuery.loading || colorQuery.loading || EpicColorQuery.loading) return null
    const handleOwnerChange = (action) => {
        setOwner(action != null ? action.value : null)
    }

    const handleSizeChange = (event) => {
        setSize(parseFloat(event.target.value))
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleContentChange = (event) => {
        setContent(event.target.value)
    }

    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const handleColorsChange = (event) => {
        setColors(Array.isArray(event) ? event.map((color) => color.value) : [])
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

    const handleSave = (event) => {
        event.preventDefault()
        const eventId = window.localStorage.getItem('eventId')
        editSubtask({
            variables: {
                id: editId,
                name,
                content,
                size,
                ownerId: owner,
                oldMemberIds: arrayOfOldMemberIds,
                newMemberIds: members,
                oldColorIds: arrayOfOldColorIds,
                newColorIds: colors,
                eventId
            },
        })
        toggleDialog()
    }

    const recoverState = () => {
        setName(subtask?.name)
        setSize(subtask?.size)
        setOwner(subtask?.owner ? subtask.owner.id : null)
        setMembers(subtask.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(subtask.colors.length > 0 ? arrayOfOldColorIds : [])
        setContent(subtask?.content)
    }

    const handleCancel = () => {
        recoverState()
        toggleDialog()
    }

    // Prevents closing dialog when clicking on it to edit subtask's fields
    const handleDialogClick = (e) => e.stopPropagation()

    // Modifiying userData to be of form expected by the react select component
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


    const chosenMembersData = subtask.members.map((user) => {
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

    const chosenColorsData = subtask.colors.map((color) => {
        const newObject = { value: color.id, color: color.color, label: colorNamesToList(color) }
        return newObject
    })

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

    // data for showing only the members not yet chosen
    const modifiedMemberOptions = modifiedUserData
        .filter((user) => !arrayOfOldMemberIds.includes(user.id))

    const modifiedColorOptions = modifiedColorData
        .filter((color) => !arrayOfOldColorIds.includes(color.id))

    const chosenOwnerData = modifiedUserData.map((user) => {
        let newObject
        if (user.value === owner) {
            newObject = { value: user.value, label: user.label }
        }
        return newObject
    })

    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                onClose={handleCancel}
                open={dialogStatus}
                aria-labelledby="max-width-dialog-title"
                classes={{ paper: classes.dialogPaper }}
                onClick={handleDialogClick}
            >
                <DialogTitle aria-labelledby="max-width-dialog-title">Edit subtask</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoComplete="off"
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        value={name || ''}
                        fullWidth
                        onChange={handleNameChange}
                    />
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="content"
                        label="Content"
                        type="text"
                        multiline
                        rows={3}
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
                        value={size || ''}
                        fullWidth
                        onChange={handleSizeChange}
                    />
                    <Select
                        className="selectField"
                        closeMenuOnSelect={false}
                        placeholder="Select colors"
                        options={modifiedColorOptions}
                        defaultValue={chosenColorsData}
                        components={animatedComponents}
                        isMulti
                        onChange={handleColorsChange}
                        styles={colourStyles}
                    />
                    <Select
                        className="selectField"
                        isClearable
                        placeholder="Select owner"
                        options={modifiedUserData}
                        defaultValue={chosenOwnerData}
                        onChange={handleOwnerChange}
                    />
                    <Select
                        className="selectField"
                        closeMenuOnSelect={false}
                        placeholder="Select members"
                        options={modifiedMemberOptions}
                        defaultValue={chosenMembersData}
                        components={animatedComponents}
                        isMulti
                        onChange={handleMembersChange}
                    />
                </DialogContent>
                {options === 'Save changes' ? (<div> {colorList()}</div>) : (<div></div>)}
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
                        onClick={handleSave}
                        color="primary"
                        disabled={!name}
                    >
                        Submit edit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default EditSubtaskDialog
