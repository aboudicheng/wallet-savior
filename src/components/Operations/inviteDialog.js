import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase/app";
import { FormattedMessage, injectIntl } from "react-intl";

class InviteDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            error: null,
        };
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    submit = () => {
        if (this.state.value !== "") {
            const usersRef = firebase.database().ref("users");
            const membersRef = firebase.database().ref(`groups/${this.props.groupId}/member`);
            this.setState({ error: null });
            let found = false;

            usersRef.once("value", (snapshot) => {

                for (let key in snapshot.val()) {
                    if (snapshot.val()[key].email === this.state.value) {
                        found = true;

                        //iterate through member id
                        membersRef.once("value", (s) => {
                            if (s.val().hasOwnProperty(key)) {
                                this.setState({ error: this.props.intl.formatMessage({ id: "dialogs.invite.error.already_in" }) });
                            }
                            else {
                                //push to groups field
                                membersRef.child(key).set(key);

                                //also push to personal groups field
                                usersRef.child(`${key}/groups/${this.props.groupId}`).set({ name: this.props.groupName, id: this.props.groupId });

                                this.props.handleClose(false);
                                this.props.handleMenuClose(null);
                                this.props.setSnackbarOpen(true);
                            }
                        });

                    }
                }

                if (!found) {
                    this.setState({ error: this.props.intl.formatMessage({ id: "dialogs.invite.error.not_found" }) });
                }
            });
        }
    }

    render() {
        const { error } = this.state;
        const { intl } = this.props;
        return (
            <Dialog
                open={this.props.open}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title"><FormattedMessage id="dialogs.invite.title" /></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="dialogs.invite.text" />
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label={intl.formatMessage({ id: "dialogs.invite.email" })}
                        type="text"
                        fullWidth
                        value={this.state.value}
                        onChange={this.handleChange}
                    />

                    {error && <span style={{ color: "red" }}>{error}</span>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }} color="primary">
                        <FormattedMessage id="dialogs.invite.cancel" />
                    </Button>
                    <Button onClick={this.submit} color="primary">
                        <FormattedMessage id="dialogs.invite.add" />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default injectIntl(connect(mapStateToProps)(InviteDialog));