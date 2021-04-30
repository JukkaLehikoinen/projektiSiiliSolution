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

export default function DeleteProjectPopup(props) {
    const { open, handleClose, project } = props

    const allBoardById = allBoardsByProject(project.id);
    const boardsByProjectId = useBoardById(project.id)
    const columnsQuery = useAllColumns()
    const tasksQuery = useAllTasks()

    if (allBoardById.loading || boardsByProjectId.loading || columnsQuery.loading || tasksQuery.loading) return null;


    const boards = allBoardById.data.boardsByProjectId.map((board) => {
      const newBoards = { name: board.name, id: board.id }
        return newBoards
    })
    //const columnsa = columns.data.allColumns.filter((column) => column.boardId === boardId && column.deletedAt === null)
    const columns = columnsQuery.data.allColumns
    const tasks = tasksQuery.data.allTasks
    let filteredColumns = [];
    let filteredTasks= [];
    boards.map((board) => {
      for (let i = 0; i < columns.length - 1; i++) {
        if (board.id == columns[i].boardId && columns[i].deletedAt === null) {
          for (let x = 0; x < tasks.length - 1; x++) {
            //if (tasks[x].board.id == columns[i].boardId) {
              console.log(tasks[x], '  ', columns[i].boardId)
            //}
            
          }
          //console.log([i])
          filteredColumns.push({columns: {id: columns[i].id, name: columns[i].name}})
        }
        
      }
    }) 
  console.log(tasks)

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
        
        <DialogContent> {"Columns: "}
        {columnList(filteredColumns)}
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
