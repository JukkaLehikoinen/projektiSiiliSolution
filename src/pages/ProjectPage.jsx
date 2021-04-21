import React, { useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import useProjectById from '../graphql/project/hooks/useProjectById'
import LoadingSpinner from '../components/LoadingSpinner'
import NewBoardForm from '../components/board/NewBoardForm'
import NewUserForm from '../components/user/NewUserForm'
import UserForm from '../components/user/UserForm'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import useProjectSubscriptions from '../graphql/subscriptions/useProjectSubscriptions'
import { useHistory } from "react-router-dom";

const ProjectPage = ({ id, eventId }) => {
    const queryResult = useProjectById(id)
    const [open, setOpen] = useState(false)
    const [openUserForm, setUserFormOpen] = useState(false)
    const [openUserDialog, setUserDialogOpen] = useState(false)
    const classes = projectPageStyles()
    const history = useHistory();
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickOpenUser = () => {
        setUserFormOpen(true)
    }
    const handleClickOpenUserDialog = () => {
        setUserDialogOpen(true)
    }

    useProjectSubscriptions(id, eventId)

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
    const boardsInOrder = queryResult.data.projectById.boards.slice().sort((a, b) => a.orderNumber - b.orderNumber)
    const projectName = queryResult.data.projectById.name
    const projectId = queryResult.data.projectById.id
    window.localStorage.setItem('projectId', projectId)

    return (
        <Grid>
        <Grid container justify="flex-end" >
                <Grid item >
                    <Button classes={{ root: classes.navigationButton }} onClick={() => history.push("/")}>Go Home</Button>
                </Grid>
            </Grid>
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            classes={{ root: classes.root }}
            spacing={7}
        >
            {open && <NewBoardForm setOpen={setOpen} open={open} projectId={id} />}
            {openUserForm && <NewUserForm setOpen={setUserFormOpen} open={openUserForm} />}
            {openUserDialog && <UserForm setOpen={setUserDialogOpen} open={openUserDialog} />}
            <Grid item classes={{ root: classes.title }}>
                <h1 id="landingTitle">{projectName}</h1>
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="center"
                spacing={3}
            >
                <Grid item>
                    <Button onClick={handleClickOpen} classes={{ root: classes.addNewButton }} id="addButton">
                        Add Board
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClickOpenUser} classes={{ root: classes.addNewButton }}>
                        Add User
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClickOpenUserDialog} classes={{ root: classes.addNewButton }}>
                        Users
                    </Button>
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="column"
                alignItems="center"
                spacing={2}
            >
                {boardsInOrder.map(({ id, name }) => (
                    <Grid item classes={{ root: classes.boardButtonGrid }} key={id}>
                        <Link to={`/boards/${id}`} className="boardList__button__link">
                            <Button fullWidth classes={{ root: classes.boardButton }}>
                                {name}
                            </Button>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
        </Grid>
    )
}
export default ProjectPage
