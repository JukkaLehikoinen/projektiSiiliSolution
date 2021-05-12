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
    ticketOrder, tasks, subtasks, columnId, boardId, user, color, searchTerm
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
    //console.log("column.tasks.title",column.tasks[0].title)
    let filteredTasks = ticketsInOrder;
    let all = {}  //{users: userStorage, colors:epic}
    const userzz = () => {

        if (user !== null && user.length > 0) {
            let filterdUsers = []
            all = { ...all, users: user }
            filteredTasks.map((ticket) => {
                all.users.map((user) => {
                    if (ticket.owner !== null) {
                        if (user.value === ticket.owner.id && ticket.column.id === columnId) {
                            let same = false;
                            filterdUsers.map((task) => {
                                if (task.id === ticket.id) {
                                    same = true
                                }
                            })
                            if (!same) {
                                filterdUsers.push(ticket)
                            }
                            console.log(filterdUsers)
                        }
                    }
                    if (ticket.members !== null) {
                        ticket.members.map((member) => {
                            if (user.value === member.id) {
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
                        })
                    }
                })
            })
            filteredTasks = filterdUsers
        }
    }

    userzz()

    const colors = () => {
        if (color !== null && color.length > 0) {
            let epix = [];
            all = { ...all, colors: color }
            filteredTasks.map((ticket) => {
                all.colors.map((epica) => {
                    if (ticket.colors.length === 1 && epica.value === ticket.colors[0].id) {
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
                            if (colors.id === epica.value) {
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
    }

    colors()

    let tasksAndSubTasks = [];
    if (searchTerm && searchTerm.length > 2) {
    for (let i = 0; i < filteredTasks.length; i++) {
        if (filteredTasks[i].title && filteredTasks[i].title.toLowerCase().includes(searchTerm.toLowerCase()) || filteredTasks[i].name && filteredTasks[i].name.toLowerCase().includes(searchTerm.toLowerCase())) {
            tasksAndSubTasks.push(filteredTasks[i])
        }
    }
    filteredTasks=tasksAndSubTasks
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
