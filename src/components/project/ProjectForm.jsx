import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import useAllProjects from '../../graphql/project/hooks/useAllProjects'
import Delete from "@material-ui/icons/DeleteOutlined";
import DeleteProjectPopup from './DeleteProjectPopup'
import useProjectSubscriptions from '../../graphql/subscriptions/useLandingSubscriptions'

const NewBoardForm = ({ setOpen, open }) => {
  const [project, setProject] = useState()
  const allProjects = useAllProjects();
  const [popupIsOpen, setPopupIsOpen] = useState(false)
  const [popp, setPopp] = useState(false)
  const closePopup = () => setPopupIsOpen(false)

  useProjectSubscriptions(window.localStorage.getItem('projectId'), window.localStorage.getItem('eventId'))

  if (allProjects.loading) return null;

  const popup = async (project) => {
    setPopp(true)
    setPopupIsOpen(true)
    setProject(project)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const projects = allProjects.data.allProjects
  let deleteprojects = projects;
  const projectsList = (projects) => {
    deleteprojects = projects.slice().sort((a, b) => a.orderNumber - b.orderNumber);
    return (
      <div>
        <table>
          <tbody>
            {deleteprojects.map((project, index) => (
              <tr key={index}>
                <td>{project.name} </td>
                <Delete fontSize="default" style={{ cursor: 'pointer' }} onClick={() => popup(project)} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select removal Project
          </DialogContentText>
          {projectsList(deleteprojects)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
      {popp === true ? <DeleteProjectPopup open={popupIsOpen} handleClose={closePopup} project={project} /> : <div></div>}
    </div>

  );
};
export default NewBoardForm;
