import React, { Component } from "react";
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
import { FormattedMessage, injectIntl } from "react-intl";
import * as routes from "../../constants/routes";

class DeleteDialog extends Component {

    delete = () => {
        this.props.history.push(routes.HOME);
        firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.child}`).remove();
    }

    render() {
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => this.props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"><FormattedMessage id="dialogs.delete.title" /></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormattedMessage id="dialogs.delete.text" />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.handleClose(false)} color="primary">
                        <FormattedMessage id="dialogs.delete.no" />
                    </Button>
                    <Button onClick={this.delete} color="primary" autoFocus>
                        <FormattedMessage id="dialogs.delete.yes" />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    injectIntl,
    connect(mapStateToProps),
    withRouter,
)(DeleteDialog);