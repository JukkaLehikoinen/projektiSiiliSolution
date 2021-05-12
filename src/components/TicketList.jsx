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
    ticketOrder, tasks, subtasks, columnId, boardId, epic, userStorage, column
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
    console.log(column)
    let filteredTasks = ticketsInOrder;
    let all = {}  //{users: userStorage, colors:epic}

    const userzz = () => {
        console.log(userStorage)
        let filterdUsers = []
        userStorage = JSON.parse(userStorage)
        all = { ...all, users: userStorage }
        filteredTasks.map((ticket) => {
            all.users.map((user) => {
                
                if (ticket.owner !== null) {
                    if (user === ticket.owner.id && ticket.column.id === columnId) {
                        let same = false;                   
                        filterdUsers.map((task) => {
                            if (task.id === ticket.id) {
                                same = true
                            }
                        })
                        if (!same) {
                            filterdUsers.push(ticket)        
                        } 

                    }
                }
            })
        })
        filteredTasks = filterdUsers
    }

    if (userStorage) {
        userzz()
    }

    const colors = () => {
        let epix = [];
        epic = JSON.parse(epic);
        all = { ...all, colors: epic }
        filteredTasks.map((ticket) => {
            all.colors.map((epica) => {
                if (ticket.colors.length === 1 && epica === ticket.colors[0].id) {
                    let same = false;                   
                    epix.map((task) => {
                                if (task.id === ticket.id) {
                                    same = true
                                }
                            })
                            if (!same) {
                                epix.push(ticket)  
                            } 
                } else {
                    ticket.colors.map((colors) => {
                        if (colors.id === epica) {
                            let same = false;                   
                            epix.map((task) => {
                                if (task.id === ticket.id) {
                                    same = true
                                }
                            })
                            if (!same) {
                                epix.push(ticket)  
                            } 
    
                        }
                    })
                }
            })
        })
        filteredTasks = epix;
    }

    if (epic) {
       colors()
    }
    console.log(filteredTasks)


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
