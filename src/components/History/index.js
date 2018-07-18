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
import CircularProgress from '@material-ui/core/CircularProgress';
import formatNumber from "format-number";
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import Delete from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper'
import DeleteAll from './deleteAll'

const styles = theme => ({
    root: {
        width: '100%',
    },
    deleteButton: {
        margin: theme.spacing.unit,
        right: "1.8rem",
        bottom: "1.8rem",
        position: "fixed",
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
            isLoading: true,
            history: [],
            deleteAllDialog: false,
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        usersRef.child(this.props.authUser.uid).child("history").on('child_added', snapshot => {
            this.setState(prevState => ({
                history: [...prevState.history, snapshot.val()],
                isLoading: false
            }))
        })

        usersRef.child(this.props.authUser.uid).on('value', snapshot => {
            if (!snapshot.val().history) {
                this.setState({ isLoading: false })
            }
        })
    }

    componentWillUnmount() {
        this.setSnackbar(false)
    }

    handleDeleteAllDialog = (open) => {
        this.setState({ deleteAllDialog: open })
    }

    deleteAllHistory = () => {
        this.setState({ history: [] })
        usersRef.child(this.props.authUser.uid).update({ history: false })
    }

    setSnackbar = (open) => {
        this.setState({ snackbarOpen: open })
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setSnackbar(false)
    };

    render() {
        const { history, deleteAllDialog, isLoading, snackbarOpen } = this.state
        const { classes } = this.props
        return (
            <div>
                <h1>History</h1>
                {isLoading
                    ? <CircularProgress className={classes.progress} size={50} />
                    : history.length === 0
                        ? <p>You have no records yet.</p>
                        : <div>
                            {history.slice().reverse().map((record, i) => {
                                return (
                                    <ExpansionPanel key={"panel" + i}>
                                        <ExpansionPanelSummary key={"summary" + i} expandIcon={<ExpandMoreIcon />}>
                                            <Typography key={"typo1" + i} className={classes.heading}>{`${record.date.day} ${record.date.month} ${record.date.year} ${record.date.hour}:${record.date.min}:${record.date.sec}`}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails key={"details" + i}>
                                            <Typography key={"wallet" + i}>
                                                {`Wallet: ${record.wallet} `}
                                            </Typography>
                                            <Typography key={"type" + i}>
                                                {`Type: ${record.type} `}
                                            </Typography>
                                            <Typography key={"amount" + i}>
                                                {`Amount: ${formatNumber({ prefix: "$" })(record.amount)} `}
                                            </Typography>
                                            {record.description !== ""
                                                ? <Typography key={"description" + i}>
                                                    {`Description:  ${record.description} `}
                                                </Typography>
                                                : <div></div>
                                            }

                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            })
                            }
                        </div>
                }
                <Tooltip TransitionComponent={Zoom} title="Delete all history">
                    <Button variant="fab" color="secondary" aria-label="Edit" className={classes.deleteButton} onClick={() => this.handleDeleteAllDialog(true)}>
                        <Delete />
                    </Button>
                </Tooltip>

                {deleteAllDialog
                    && <DeleteAll open={deleteAllDialog} handleClose={this.handleDeleteAllDialog} deleteHistory={this.deleteAllHistory} setSnackbar={this.setSnackbar} />}

                {/*Snackbar poppup*/}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        variant="success"
                        message="Operation successful!"
                    />
                </Snackbar>
            </div>
        )
    }
}

const authCondition = (authUser) => !!authUser;

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    state: state.historyState
});

export default compose(
    withAuthorization(authCondition),
    connect(mapStateToProps),
    withStyles(styles),
)(History);