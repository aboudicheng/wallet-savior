import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import firebase from "firebase/app";
import withAuthorization from "../Session/withAuthorization";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import formatNumber from "format-number";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";
import Delete from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";
import DeleteAll from "./deleteAll";

const styles = (theme) => ({
    root: {
        width: "100%",
    },
    deleteButton: {
        margin: theme.spacing.unit,
        right: "1.8rem",
        bottom: "1.8rem",
        position: "fixed",
    },
    typography: {
        width: "100%",
        fontSize: "1.2rem"
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 2,
        display: "inline-flex",
        flexFlow: "column wrap",
    }
});

const usersRef = firebase.database().ref("users/");

class History extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            history: [],
            deleteAllDialog: false,
            snackbarOpen: false,
        };
    }

    componentDidMount() {
        usersRef.child(this.props.authUser.uid).child("history").on("child_added", (snapshot) => {
            this.setState((prevState) => ({
                history: [...prevState.history, snapshot.val()],
                isLoading: false
            }));
        });

        usersRef.child(this.props.authUser.uid).once("value", (snapshot) => {
            if (!snapshot.val().history) {
                this.setState({ isLoading: false });
            }
        })
    }

    componentWillUnmount() {
        this.setSnackbar(false);
    }

    handleDeleteAllDialog = (open) => {
        this.setState({ deleteAllDialog: open });
    }

    deleteAllHistory = () => {
        this.setState({ history: [] });
        usersRef.child(this.props.authUser.uid).update({ history: false });
    }

    setSnackbar = (open) => {
        this.setState({ snackbarOpen: open });
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setSnackbar(false)
    };

    render() {
        const { history, deleteAllDialog, isLoading, snackbarOpen } = this.state;
        const { classes } = this.props;

        const fieldStyle = {
            fontWeight: "bold"
        }
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
                                    <Paper className={classes.paper} elevation={5} key={i}>
                                        <h3>
                                            {`${record.date.day} ${record.date.month} ${record.date.year} ${record.date.hour}:${record.date.min}`}
                                        </h3>
                                        <div>
                                            <span style={fieldStyle}>Wallet: </span>{record.wallet}
                                        </div>
                                        <div>
                                            <span style={fieldStyle}>Type: </span>{record.type}
                                        </div>
                                        <div>
                                            <span style={fieldStyle}>Amount: </span>{formatNumber({ prefix: "$" })(record.amount)}
                                        </div>

                                        <div>
                                            {record.description !== ""
                                                && <div><span style={fieldStyle}>Description: </span>{record.description}</div>
                                            }
                                        </div>
                                    </Paper>
                                );
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
                        vertical: "bottom",
                        horizontal: "left",
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