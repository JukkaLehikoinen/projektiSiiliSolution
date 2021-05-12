/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import { useSnackbar } from 'notistack'
import ColumnList from '../column/ColumnList'
import useMoveTicketInColumn from '../../graphql/ticket/hooks/useMoveTicketInColumn'
import useMoveTicketFromColumn from '../../graphql/ticket/hooks/useMoveTicketFromColumn'
import useMoveColumn from '../../graphql/column/hooks/useMoveColumn'
import { onDragEnd } from '../../utils/onDragEnd'
import SnackbarAlert from '../SnackbarAlert'
import '../../styles.css'

const Board = ({ board, eventId, color, user, searchTerm }) => {
    const [moveTicketInColumn] = useMoveTicketInColumn()
    const [moveTicketFromColumn] = useMoveTicketFromColumn()
    const [moveColumn] = useMoveColumn()
    const client = useApolloClient()
    const [snackbarMessage, setSnackbarMessage] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    useEffect((message) => {
        setSnackbarMessage(message)
    }, [])
    const { columnOrder, columns } = board
    return (
        <Grid container>
            <DragDropContext onDragEnd={(result) => onDragEnd(
                result, moveTicketInColumn, moveTicketFromColumn, moveColumn, client, columns, board, enqueueSnackbar,
            )}
            >

                <Droppable droppableId={board.id} direction="horizontal" type="column">
                    {(provided) => (
                        <Grid
                            item
                            container
                            direction="row"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            spacing={2}
                        >
                            <Grid item><ColumnList columns={columns} columnOrder={columnOrder} boardId={board.id} searchTerm = {searchTerm} color={color} user={user} /></Grid>
                            {provided.placeholder}

                        </Grid>
                    )}
                </Droppable>

            </DragDropContext>
            <Grid container item>
                <SnackbarAlert message={snackbarMessage} />
            </Grid>
        </Grid>
    )
}
export default Board
