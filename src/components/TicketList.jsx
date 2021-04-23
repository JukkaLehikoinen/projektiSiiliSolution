import React from 'react'
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
    
    const epic = window.localStorage.getItem("epic")
    const TicketList = ({
        ticketOrder, tasks, subtasks, columnId, boardId,
    }) => {
        const ticketsInOrder = ticketOrder.map((obj) => {
            const user = window.localStorage.getItem("user")
            //console.log(user)
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
            //console.log('epic', epic)
            let filteredTasks = [];
            if (epic !== 'ALL') {
            ticketsInOrder.map((ticket) => {

                if (ticket.colors.length > 1) {
                    ticket.colors.map((color) =>{
                        if (color.id === epic) {
                            console.log('moniväriset', ticket.id)
                            filteredTasks.push(ticket)
                        }
                        
                    })
                } else {
                    if (ticket.colors[0].id === epic) {
                        console.log('yksiväriset', ticket.id)
                        filteredTasks.push(ticket)
                    }
                }
            })
        } else {
            filteredTasks = ticketsInOrder;
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
