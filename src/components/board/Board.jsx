/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import ColumnList from '../column/ColumnList'
import useMoveTicketInColumn from '../../graphql/ticket/hooks/useMoveTicketInColumn'
import useMoveTicketFromColumn from '../../graphql/ticket/hooks/useMoveTicketFromColumn'
import useMoveColumn from '../../graphql/column/hooks/useMoveColumn'
import { dragEnded } from '../../utils/dragEnded'
import SnackbarAlert from '../SnackbarAlert'
import '../../styles.css'

const Board = ({ board }) => {
    const [moveTicketInColumn] = useMoveTicketInColumn()
    const [moveTicketFromColumn] = useMoveTicketFromColumn()
    const [moveColumn] = useMoveColumn()
    const client = useApolloClient()
    const [snackbarStatus, setSnackbarStatus] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState(null)

    const toggleSnackbar = (message) => {
        setSnackbarMessage(message)
        setSnackbarStatus(!snackbarStatus)
    }

    const { columnOrder, columns } = board

    return (
        <Grid container>
            <DragDropContext onDragEnd={(result) => dragEnded(
                result, moveTicketInColumn, moveTicketFromColumn, moveColumn, client, columns, board, toggleSnackbar,
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
                            <Grid item><ColumnList columns={columns} columnOrder={columnOrder} boardId={board.id} /></Grid>
                            {provided.placeholder}

                        </Grid>
                    )}
                </Droppable>

            </DragDropContext>
            <Grid container item>
                <SnackbarAlert snackbarStatus={snackbarStatus} toggleSnackbar={toggleSnackbar} message={snackbarMessage} />
            </Grid>
        </Grid>
    )
}
export default Board
