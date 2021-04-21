import React, { useState, useEffect } from 'react'
import {
    Grid, FormControlLabel, Switch, Button
} from '@material-ui/core'
import Board from '../components/board/Board'
import SwimlaneView from '../components/swimlane/SwimlaneView'
import { boardPageStyles } from '../styles/styles'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import { useHistory } from "react-router-dom";
import useBoardById from '../graphql/board/hooks/useBoardById'
import useBoardSubscriptions from '../graphql/subscriptions/useBoardSubscriptions'
import { client } from '../apollo'
import Select from 'react-select'
import useAllUsers from '../graphql/user/hooks/useAllUsers'
import bubbleSort from '../components/bubblesort'
//import useAllColors from '../../graphql/task/hooks/useAllColors'

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
    const userQuery = useAllUsers()
    const projectId = window.localStorage.getItem('projectId')
    //const colorQuery = useAllColors()
    const [user, setUser] = useState("")



    if (queryResult.loading) return null
    const board = queryResult.data.boardById

    const switchView = () => {
        toggleView(view === 'kanban' ? 'swimlane' : 'kanban')
    }

    const handleUserChange = (event) => {
        if (event === null) {
            setUser()
            window.localStorage.setItem("user", "")
        } else {
            setUser(event.value)
            window.localStorage.setItem("user", event.value)
            //return event.value
        }
        console.log(event)
    }
    console.log(user)

    let userList = [];
    userQuery.data.allUsers.filter((user) => !user.userName.includes(' (Removed user)')).map((user) => {
        if (user.projectId === projectId) {
            userList.push(user)
        }
    });

    let alphabeticalOrder = bubbleSort(userList);
    const modifiedUserData = alphabeticalOrder.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    return (
        <Grid
            container
            direction="row"
            classes={{ root: classes.root }}
            id="boardElement"
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
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={2}>
                        <Select
                            className="selectField"
                            closeMenuOnSelect={false}
                            placeholder="Select color"
                            //defaultValue={chosenColorsData}
                            //components={animatedComponents}
                            //isMulti
                            //onChange={handleColorsChange}
                            id="taskSelectColor"
                        //options={modifiedColorOptions}
                        //styles={colourStyles}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Select
                            className="selectField"
                            closeMenuOnSelect={false}
                            placeholder="Select user"
                            //defaultValue={null}
                            //components={animatedComponents}
                            //isMulti
                            onChange={handleUserChange}
                            id="taskSelectColor"
                            options={modifiedUserData}
                            isClearable={true}
                        // handleUserChange={}
                        //styles={colourStyles}
                        />
                    </Grid>
                </Grid>
            </Grid>


            <Grid item>
                {view === 'kanban' ? <Board board={board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
