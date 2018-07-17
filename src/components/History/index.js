import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import firebase from 'firebase';
import withAuthorization from '../Session/withAuthorization';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});

const usersRef = firebase.database().ref('users/')

class History extends Component {
    constructor() {
        super();

        this.state = {
            history: [],
        }

    }

    componentDidMount() {
        usersRef.child(this.props.authUser.uid).child("history").on('child_added', snapshot => {
            
        })
    }

    render() {
        const { history } = this.state
        const { classes } = this.props
        return (
            <div>
                <h1>History</h1>
                {history.length === 0
                    ? <p>You have no records yet.</p>
                    : <div>
                        {history.map((record, i) => {
                            return (
                                <ExpansionPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>{i}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            {record.sth}
                                        </Typography>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                        })}
                    </div>
                }
            </div>
        )
    }
}

const authCondition = (authUser) => !!authUser;

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    withAuthorization(authCondition),
    connect(mapStateToProps),
    withStyles(styles),
)(History);