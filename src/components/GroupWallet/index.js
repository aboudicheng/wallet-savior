import React, { Component } from 'react';
import { compose } from 'recompose';
import firebase from 'firebase/app'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import formatNumber from "format-number";

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
})

class GroupWallet extends Component {
    constructor() {
        super();

        this.state = {
            group: null,
            isLoading: true,
        }

    }

    componentDidMount() {
        firebase.database().ref(`groups/${this.props.match.params.id}`).on('value', snapshot => {
            this.setState({ group: snapshot.val(), isLoading: false })
        })
    }

    render() {
        const { group, isLoading } = this.state
        const { classes } = this.props
        return (
            <div>
                {isLoading
                    ? <CircularProgress className={classes.progress} size={50} />
                    : <div>
                        <h1>{group.name}</h1>
                        <span style={{ fontSize: "170%", color: group.money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(group.money).toFixed(2))}</span>
                    </div>
                }
            </div>
        )
    }
}

export default compose(
    withStyles(styles)
)(GroupWallet);