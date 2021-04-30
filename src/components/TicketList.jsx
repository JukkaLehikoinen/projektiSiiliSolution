import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import Task from './task/Task'
import Subtask from './subtask/Subtask'

// const TicketList = ({
//     ticketOrder, tasks, subtasks, columnId, boardId,
// }) => {
//     const ticketsInOrder = ticketOrder.map((obj) => {
//         let foundTicket
//         if (obj.type === 'task') {
//             foundTicket = tasks.find((task) => task.id === obj.ticketId)
//             foundTicket = { ...foundTicket, type: 'task' }
//         } else if (obj.type === 'subtask') {
//             foundTicket = subtasks.find((subtask) => subtask.id === obj.ticketId)
//             foundTicket = { ...foundTicket, type: 'subtask' }
//         }
//         return foundTicket
//     })
 
    const TicketList = ({
        ticketOrder, tasks, subtasks, columnId, boardId, epic, userStorage
    }) => {
        const ticketsInOrder = ticketOrder.map((obj) => {
            let foundTicket
            if (obj.type === 'task') {
                foundTicket = tasks.find((task) => task.id === obj.ticketId)
                foundTicket = { ...foundTicket, type: 'task' }
            } else if (obj.type === 'subtask') {
                foundTicket = subtasks.find((subtask) => subtask.id === obj.ticketId)
                foundTicket = { ...foundTicket, type: 'subtask' }
            }
            return foundTicket
        })        


        let filteredTasks = [];
        if (userStorage.length > 0) {
            const selectedUsers = JSON.parse(userStorage)
            selectedUsers.map((user) => {
            ticketsInOrder.map((ticket) => {
                if (ticket.members.length > 0) {
                    ticket.members.map((members) =>{
                        if (members.id === user) {
                                 let same = false;                   
                            filteredTasks.map((task) => {
                                if (task.id === ticket.id) {
                                    same = true
                                }
                            })
                            if (!same) {
                                filteredTasks.push(ticket)  
                            } 
                        }
                    })
                }
                if (ticket.owner !== null) {
                    if (ticket.owner.id === user) {
                        let same = false;                   
                        filteredTasks.map((task) => {
                            if (task.id === ticket.id) {
                                same = true
                            }
                        })
                        if (!same) {
                            filteredTasks.push(ticket)  
                        } 
                    }
                }
            })
        })
    }

            if (epic.length > 0) {
            const epicColors = JSON.parse(epic)
            epicColors.map((epic) => {
            ticketsInOrder.map((ticket) => {

                if (ticket.colors.length > 1) {
                    ticket.colors.map((color) =>{
                        if (color.id === epic) {
                                 let same = false;                   
                            filteredTasks.map((task) => {
                                if (task.id === ticket.id) {
                                    same = true
                                }
                            })
                            if (!same) {
                                filteredTasks.push(ticket)  
                            } 
                        }
                    })
                } else if (ticket.colors.length == 1) {
                    if (ticket.colors[0].id === epic) {
                        let same = false;                   
                        filteredTasks.map((task) => {
                            if (task.id === ticket.id) {
                                same = true
                            }
                        })
                        if (!same) {
                            filteredTasks.push(ticket)  
                        } 
                    }
                }
            })
        })
    }
     
    if (filteredTasks.length < 1) {
        filteredTasks = ticketsInOrder
    }

        
    return (
        <Grid container direction="column" alignItems='center' spacing={2}>
            {filteredTasks.map((ticket, index) => {
                
                let component
                if (ticket.type === 'task') {
                    component = (
                        <Grid item key={ticket.id}>
                            <Task index={index} task={ticket} columnId={columnId} boardId={boardId} />
                        </Grid>
                    )
                } else if (ticket.type === 'subtask') {
                    component = (
                        <Grid item key={ticket.id}>
                            <Subtask key={ticket.id} index={index} subtask={ticket} columnId={columnId} />
                        </Grid>
                    )
                }

                return component
            })}
        </Grid>
    )
}

export default React.memo(TicketList)
