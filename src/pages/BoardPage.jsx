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
import Select from 'react-select'
import useAllUsers from '../graphql/user/hooks/useAllUsers'
import useAllEpicColors from '../graphql/colorboards/hooks/useAllEpicColors'
import bubbleSort from '../components/bubblesort'
import useAllColors from '../graphql/task/hooks/useAllColors'
//import useAllColors from '../../graphql/task/hooks/useAllColors'
import TextField from '@material-ui/core/TextField';

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
    const epicColorQuery = useAllEpicColors()
    const projectId = window.localStorage.getItem('projectId')
    const colorQuery = useAllColors()
    const [user, setUser] = useState("")
    const [color, setColor] = useState([])
    const [searchTerm, setSearchTerm] = useState("")



    if (queryResult.loading || colorQuery.loading || userQuery.loading || epicColorQuery.loading) {
        return <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: '20%',
                color: "#FF8E53"
            }}>
            <LoadingSpinner />
        </div>
    }
    const board = queryResult.data.boardById

    const switchView = () => {
        toggleView(view === 'kanban' ? 'swimlane' : 'kanban')
    }
    const handleUserChange = (event) => {
        if (event === null || event.length == 0) {
            setUser(event)
            window.localStorage.setItem("user", [''])
        } else {
            setUser(event)
            const users = event.map((event) => {
                return event.value
            })
            window.localStorage.setItem("user", JSON.stringify(users))
        }
        // console.log(event)
    }
    //console.log(user)

    const handleColorChange = (event) => {
        if (event === null || event.length === 0) {
            setColor(event)
            window.localStorage.setItem("epic", [''])
        } else {
            setColor(event)
            const colors = event.map((event) => {
                return event.value
            })
            window.localStorage.setItem("epic", JSON.stringify(colors))
        }
    }

    let userList = [];
    userQuery.data.allUsers.filter((user) => !user.userName.includes(' (Removed user)')).map((user) => {
        if (user.projectId === projectId) {
            userList.push(user)
        }
    });

    let length;
    let colors = epicColorQuery.data.allEpicColors.filter((color) => color.boardId === id)
    if (colors.length === 0) {
        length = 0;
        colors = colorQuery.data.allColors
    }

    const allEpicColors = colors.map((color) => {
        let labelOption;
        let valueOption;
        if (length === 0) {
            valueOption = color.id
            labelOption = color.color
        } else {
            valueOption = color.colorId
            labelOption = color.name
        }
        const newColor = { value: valueOption, label: labelOption }
        return newColor
    })
    //allEpicColors.push({value: 'ALL', label: 'ALL'})

    let alphabeticalOrder = bubbleSort(userList);
    const modifiedUserData = alphabeticalOrder.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const editSearchTerm = (e) => {
        setSearchTerm({ searchTerm: e.target.value })
    }
    console.log("column task", columns.tasks.title)
    // const dynamicSearch = () => {
    //     return tasks.name.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    // }

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
                            //defaultValue={allEpicColors[9]}
                            //components={animatedComponents}
                            isMulti
                            onChange={handleColorChange}
                            //id="taskSelectColor"
                            options={allEpicColors}
                            isClearable={true}
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
                            isMulti
                            onChange={handleUserChange}
                            id="taskSelectColor"
                            options={modifiedUserData}
                            isClearable={true}
                        // handleUserChange={}
                        //styles={colourStyles}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField type='text' value={searchTerm} onChange={editSearchTerm} placeholder='Search by task name!' />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                {view === 'kanban' ? <Board board={board} color={color} user={user} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
