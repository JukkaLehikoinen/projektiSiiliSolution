import React, { useState } from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import Column from './Column'
import { boardPageStyles } from '../../styles/styles'
import useAddColumn from '../../graphql/column/hooks/useAddColumn'

const ColumnList = ({ columns, columnOrder, boardId, color, user }) => {
    const classes = boardPageStyles()
    const [columnName, setColumnName] = useState('')
    const [addColumn] = useAddColumn()

    const handleChange = (event) => {
        setColumnName(event.target.value)
    }

    const handleSave = () => {
        const eventId = window.localStorage.getItem('eventId')

        addColumn({
            variables: {
                boardId,
                columnName,
                eventId,
            },
        })
        setColumnName('')
    }

    const newColumnOrder = columnOrder.map((id) => columns.find((column) => column.id === id))
    return (
        <Grid container direction="row" spacing={4} classes={{ root: classes.columnRow }}>
            {newColumnOrder.map((column, index) => (
                <Grid item key={column.id}>
                    <Column column={column} index={index} color={color} user={user}/>
                </Grid>
            ))}
            <Grid item classes={{ root: classes.addColumn }}>
                <TextField
                    margin="dense"
                    name="title"
                    label="Name"
                    type="text"
                    value={columnName}
                    fullWidth
                    onChange={handleChange}
                    id="inputColumnName"
                />
                <Button
                    disabled={!columnName.length}
                    color="primary"
                    onClick={handleSave}
                    id="addColumnButton"
                >
                    Add
                </Button>
            </Grid>
        </Grid>
    )
}
export default ColumnList
