import React, { Component } from "react";
import _ from "lodash";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as firebase from "firebase/app";
import * as routes from "../../constants/routes";

class QuitDialog extends Component {

    delete = () => {
        this.props.history.push(routes.HOME);
        //pop both from the groups field and user"s groups field
        firebase.database().ref(`users/${this.props.authUser.uid}/groups/${this.props.child}`).remove();

        firebase.database().ref(`groups/${this.props.child}/member/`).once("value", (snapshot) => {
            const members = _.values(snapshot.val())
            //if there is only one member left, delete the whole group
            if (members.length === 1) {
                firebase.database().ref(`groups/${this.props.child}`).remove();
            }
            else {
                members.forEach((member, i) => {
                    if (member === this.props.authUser.uid) {
                        firebase.database().ref(`groups/${this.props.child}/member/${i}`).remove();
                    }
                });
            }
        });
    }

    render() {
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => this.props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Quit"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure to quit this group?
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.handleClose(false)} color="primary">
                        No
      </Button>
                    <Button onClick={this.delete} color="primary" autoFocus>
                        Yes
          </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    connect(mapStateToProps),
    withRouter
)(QuitDialog);