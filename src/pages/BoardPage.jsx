import React, { useState, useEffect } from 'react'
import {
    Grid, FormControlLabel, Switch, Button
} from '@material-ui/core'
import LoadingSpinner from '../components/LoadingSpinner'
import Board from '../components/board/Board'
import SwimlaneView from '../components/swimlane/SwimlaneView'
import { boardPageStyles } from '../styles/styles'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import { useHistory } from "react-router-dom";
import useBoardById from '../graphql/board/hooks/useBoardById'
import useBoardSubscriptions from '../graphql/subscriptions/useBoardSubscriptions'
import { client } from '../apollo'

const BoardPage = ({ id, eventId }) => {
    useEffect(() => () => {
        client.resetStore()
    }, [])
    const classes = boardPageStyles()
    const projectClasses = projectPageStyles()
    const history = useHistory();
    const [view, toggleView] = useState('kanban')
    const queryResult = useBoardById(id)
    useBoardSubscriptions(id, eventId)

    if (queryResult.loading) {
        return <div 
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: '20%',
                    color: "#FF8E53"
                }}>
                <LoadingSpinner/>
            </div>
    }
    const board = queryResult.data.boardById

    const switchView = () => {
        toggleView(view === 'kanban' ? 'swimlane' : 'kanban')
    }

    return (
        <Grid
            container
            direction="row"
            classes={{ root: classes.root }}
            id="boardElement"
        // spacing={3}
        >   
            <Grid container justify="flex-end" >
                <Grid item >
                    <Button classes={{ root: projectClasses.navigationButton }} onClick={() => window.history.back()}>Go Back</Button>    
                    <Button classes={{ root: projectClasses.navigationButton }} onClick={() => history.push("/")}>Go Home</Button>
                </Grid>
            </Grid>
            <Grid container item direction="column" justify="space-between" classes={{ root: classes.boardHeader }} id="boardHeader">                
                <Grid item >
                    <h1>{board.name}</h1>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Switch onChange={switchView} />}
                        label="Show swimlanes"
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>

            <Grid item>
                {view === 'kanban' ? <Board board={board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
