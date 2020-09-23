/* eslint-disable object-curly-newline */
import React, { useState } from 'react'
import { Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle } from '@material-ui/core'
import Select from 'react-select'
import useAddTask from '../graphql/task/hooks/useAddTask'
import useAllUsers from '../graphql/user/hooks/useAllUsers'

const TaskDialog = ({ dialogStatus, column, toggleDialog }) => {
    const { loading, data } = useAllUsers()
    const [addTask] = useAddTask(column.id)
    const [title, setTitle] = useState('')
    const [size, setSize] = useState(null)
    const [owner, setOwner] = useState('')

    if (loading) return null

    const handleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleOwnerChange = (action) => {
        console.log(action)
    }

    const handleSizeChange = (event) => {
        if (event.target.value === '') {
            setSize(null)
            return
        }
        setSize(parseFloat(event.target.value))
    }

    const handleSave = (event) => {
        event.preventDefault()
        addTask({
            variables: {
                columnId: column.id,
                title,
                size,
                owner,
            },
        })
        toggleDialog()
        setTitle('')
        setSize(null)
        setOwner('')
    }

    const modifiedData = data.allUsers.map((user) => {
        const newObject = { value: user.userName, label: user.userName}
        return newObject
    })

    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                paper={{ minHeight: 50 }}
                onClose={toggleDialog}
                open={dialogStatus}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle aria-labelledby="max-width-dialog-title">Create new task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="title"
                        label="Name"
                        type="text"
                        value={title}
                        fullWidth
                        onChange={handleChange}
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={owner}
                        isClearable
                        isSearchable
                        name="owner"
                        inputValue={owner}
                        value={owner}
                        options={modifiedData}
                        onChange={handleOwnerChange}
                        onInputChange={handleOwnerChange}
                    />
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="size"
                        label="Size"
                        type="number"
                        value={size || ''}
                        fullWidth
                        onChange={handleSizeChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={toggleDialog}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!title.length}
                        onClick={handleSave}
                        color="primary"
                    >
                        Create task
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default TaskDialog
