import React, { useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import useAllProjects from '../graphql/project/hooks/useAllProjects'
import NewProjectForm from '../components/project/NewProjectForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectForm from "../components/project/ProjectForm";

const LandingPage = () => {
    const queryResult = useAllProjects()
    const [open, setOpen] = useState(false)
    const [projectDialogOpen, setProjectDialogOpen] = useState(false)
    const classes = projectPageStyles()

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickOpenProjectDialog = () => {
        setProjectDialogOpen(true);
      };

    if (queryResult.loading) {

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

    if (queryResult.error) {
        console.log(queryResult.error)
        return <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: '15%',
                // color: "#FF8E53"
            }}>
            
            <div>
            <img src="https://cdn.pixabay.com/photo/2018/01/04/15/51/404-error-3060993_960_720.png" height= "150" width="150"/>
                <li>
                    <ul>Something went wrong!</ul>
                    <ul>What caused this error:</ul>
                
                    <br></br>
                    <ol>1. Check your internet connection</ol>
                    <ol>2. There might be an error in the database</ol>
                    <ol>3. Who knows?</ol>
                    <ol>4. Contact the admin about this problem</ol>
                    <ol>5. Go do something else while the problem is solved</ol>
                    <ol>6. Have a nice day!</ol>
                </li>
            </div>

        </div>
    }

    const projectsInOrder = queryResult.data.allProjects.slice().sort((a, b) => a.orderNumber - b.orderNumber)

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            classes={{ root: classes.root }}
            spacing={7}
        >
            {open && <NewProjectForm setOpen={setOpen} open={open} />}
            <Grid item classes={{ root: classes.title }}>
                <h1 id="landingTitle">Welcome!</h1>
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
                        Add Project
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleClickOpenProjectDialog}
                        classes={{ root: classes.addNewButton }}>
                        Delete Project
                    </Button>
                    {projectDialogOpen && (
                    <ProjectForm setOpen={setProjectDialogOpen} open={projectDialogOpen} />
        )}
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="column"
                alignItems="center"
                spacing={2}
            >
                {projectsInOrder.map(({ id, name }) => (
                    <Grid item classes={{ root: classes.boardButtonGrid }} key={id}>
                        <Link to={`/projects/${id}`} className="boardList__button__link">
                            <Button fullWidth classes={{ root: classes.boardButton }}>
                                {name}
                            </Button>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}
export default LandingPage
