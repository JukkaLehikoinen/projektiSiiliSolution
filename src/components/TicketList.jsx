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
    
    const TicketList = ({
        ticketOrder, tasks, subtasks, columnId, boardId,
    }) => {
        const ticketsInOrder = ticketOrder.map((obj) => {
            const user = window.localStorage.getItem("user")
            console.log(user)
            console.log(typeof(tasks))
            console.log(tasks)
            console.log(tasks.includes(user))
            let foundTicket
            if (obj.type === 'task') {
                foundTicket = tasks.find((task) => task.id === obj.ticketId)
                foundTicket = { ...foundTicket, type: 'task' }
            } else if (obj.type === 'subtask') {
                foundTicket = subtasks.find((subtask) => subtask.id === obj.ticketId)
                foundTicket = { ...foundTicket, type: 'subtask' }
            }
            //window.localStorage.clear()
            return foundTicket
        })

        
    return (
        <Grid container direction="column" alignItems='center' spacing={2}>
            {ticketsInOrder.map((ticket, index) => {
                
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
