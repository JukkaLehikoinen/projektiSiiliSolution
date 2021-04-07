import React from 'react'
import { Grid } from '@material-ui/core'
import { boardPageStyles } from '../styles/styles'

const MemberCircle = ({ name }) => {
    const classes = boardPageStyles()
    let color = classes.memberCircle
    if (name.includes(' (Removed user')) {
        color = classes.deletedMemberCircle
    }
    return (
        <Grid item container>
            <Grid item container direction='column' justify='center' classes={{ root: color }}>
                <Grid item><p>{name.charAt(0).toUpperCase()}</p></Grid>
            </Grid>
        </Grid>
    )
}
export default MemberCircle