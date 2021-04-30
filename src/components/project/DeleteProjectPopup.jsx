import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import allBoardsByProject from "../../graphql/project/hooks/useBoardsByProjectId";
import useBoardById from '../../graphql/board/hooks/useBoardById'
import useAllColumns from '../../graphql/column/hooks/useAllColumns'
import useAllTasks from '../../graphql/task/hooks/useAllTasks'
import useAllSubtasks from '../../graphql/subtask/hooks/useAllSubTasks'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'

export default function DeleteProjectPopup(props) {
    const { open, handleClose, project } = props

    const allBoardById = allBoardsByProject(project.id);
    const boardsByProjectId = useBoardById(project.id)
    const columnsQuery = useAllColumns()
    const tasksQuery = useAllTasks()
    const subTasksQuery = useAllSubtasks()
    const userQuery = useAllUsers()

    if (allBoardById.loading || boardsByProjectId.loading || columnsQuery.loading || tasksQuery.loading || subTasksQuery.loading || userQuery.loading) return null;


    const boards = allBoardById.data.boardsByProjectId.map((board) => {
      const newBoards = { name: board.name, id: board.id }
        return newBoards
    })
    //const columnsa = columns.data.allColumns.filter((column) => column.boardId === boardId && column.deletedAt === null)
    const columns = columnsQuery.data.allColumns
    const tasks = tasksQuery.data.allTasks
    const subTasks = subTasksQuery.data.allSubTasks
    const users = userQuery.data.allUsers.filter((user) => user.projectId === project.id && !user.userName.includes(' (Removed user)'))
    let filteredColumns = [];
    let filteredTasks= [];
    let filteredSubTasks= [];
    boards.map((board) => {
      for (let i = 0; i < columns.length; i++) {
        if (board.id == columns[i].boardId && columns[i].deletedAt === null) {
          for (let x = 0; x < tasks.length; x++) {
            if (tasks[x].column.id == columns[i].id) {
              for (let y = 0; y < subTasks.length; y++) {
                if (tasks[x].id === subTasks[y].task.id) {
                  filteredSubTasks.push({subtasks: {id: subTasks[y].id, name: subTasks[y].name}})
                }
              }
              filteredTasks.push({tasks: {id: tasks[x].id, name: tasks[x].title }})
            }
            
          }
          //console.log([i])
          filteredColumns.push({columns: {id: columns[i].id, name: columns[i].name}})
        }
        
      }
    }) 
  console.log(filteredSubTasks)

    const boardsList = (boards) => {
     let deleteBoards = boards.slice().sort((a, b) => a.orderNumber - b.orderNumber);
     console.log('sadasd ',deleteBoards)
      return (
        <div>
          <table>
            <tbody>
              {deleteBoards.map((board, index) => (
                <tr key={index}>
                  <td>{board.name} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const columnList = (columns) => {
      let deleteColumns = columns.slice().sort((a, b) => a.orderNumber - b.orderNumber);
      console.log('sadasd ',deleteColumns)
       return (
         <div>
           <table>
             <tbody>
               {deleteColumns.map((column, index) => (
                 <tr key={index}>
                   <td>{column.columns.name} </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     }
    
     const tasksList = (tasks) => {
      let deleteTasks = tasks.slice().sort((a, b) => a.orderNumber - b.orderNumber);
      console.log('sadasd ',deleteTasks)
       return (
         <div>
           <table>
             <tbody>
               {deleteTasks.map((task, index) => (
                 <tr key={index}>
                   <td>{task.tasks.name} </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     }

     const subTasksList = (subtasks) => {
      let deleteSubTasks = subtasks.slice().sort((a, b) => a.orderNumber - b.orderNumber);
      console.log('sadasd ',deleteSubTasks)
       return (
         <div>
           <table>
             <tbody>
               {deleteSubTasks.map((subtask, index) => (
                 <tr key={index}>
                   <td>{subtask.subtasks.name} </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     }

     const usersList = (users) => {
      let deleteUsers = users.slice().sort((a, b) => a.orderNumber - b.orderNumber);
      console.log('sadasd ',deleteUsers)
       return (
         <div>
           <table>
             <tbody>
               {deleteUsers.map((user, index) => (
                 <tr key={index}>
                   <td>{user.userName} </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     }
     
    
     const handleSave = async () => {
         /* await deleteBoard({
               variables: {
                    id: board.id,
                    name: board.name,
                    projectId: window.localStorage.getItem("projectId"),
                 },
            })
            window.location.reload(false); */
       handleClose()
    }
  

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> {"Are you sure you want to delete " + props.project.name } </DialogTitle>
        <DialogTitle id="alert-dialog-title"> PROJECT INCLUDES </DialogTitle>
        <DialogContent> Boards:</DialogContent>

        <DialogContent style={{color:"black"}}>
        {boardsList(boards)}
        </DialogContent>
        
        <DialogContent> Columns:
        {columnList(filteredColumns)}
        </DialogContent>
        <DialogContent> Tasks:
        {tasksList(filteredTasks)}
        </DialogContent>
        <DialogContent> Subtasks:
        {subTasksList(filteredSubTasks)}
        </DialogContent>
        <DialogContent> Users:
        {usersList(users)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleSave} color="primary"  autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
  }
