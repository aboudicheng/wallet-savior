import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import firebase from "firebase/app";
import { withRouter } from "react-router";
import * as routes from "../../constants/routes";

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class DeleteAccount extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    confirmDelete = () => {
        this.handleClose();

        firebase.auth().currentUser.delete().then(() => {
            //remove membership from every single group the user belongs to
            firebase.database().ref(`users/${this.props.authUser.uid}/groups`).once("value", (snapshot) => {
                //if user belongs to any group
                if (snapshot.val()) {
                    for (let key in snapshot.val()) {
                        firebase.database().ref(`groups/${snapshot.val()[key].id}/member/${this.props.authUser.uid}`).remove();

                        //if there"s no one else in the group, delete the whole group as well
                        firebase.database().ref(`groups/${snapshot.val()[key].id}/member`).once("value", (s) => {
                            if (!s.val()) {
                                firebase.database().ref(`groups/${snapshot.val()[key].id}`).remove();
                            }
                        });
                    }
                }
            });
            //remove from database
            firebase.database().ref("users").child(this.props.authUser.uid).remove();
            this.props.history.push(routes.LOGIN);
            this.props.deleteAuthUser();

        })
    }

    render() {
        return (
            <div>
                <Button color="secondary" onClick={this.handleClickOpen}>Delete</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title"><span style={{ color: "red" }}>WARNING</span></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Everything that you have stored on this platform will be erased. Are you sure to delete this account?
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            No
            </Button>
                        <Button onClick={this.confirmDelete} color="primary">
                            Yes
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = (dispatch) => ({
    deleteAuthUser: () => dispatch({ type: "DELETE_AUTH_USER" })
})

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(DeleteAccount);