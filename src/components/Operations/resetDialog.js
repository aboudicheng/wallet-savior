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
import { months } from "../../constants/months";

const usersRef = firebase.database().ref("users/");

class ResetDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
        };
    }

    handleChange = (e, prop) => {
        this.setState({ [prop]: e.target.value });
    }

    submit = () => {
        if (this.state.value.length !== 0 && !isNaN(this.state.value)) {
            const date = new Date();

            this.props.handleClose(false);
            this.props.handleMenuClose(null);

            const money = parseFloat(this.state.value).toFixed(2);

            if (this.props.group) {
                firebase.database().ref(`groups/${this.props.child}`).update({ money });
            }
            else {
                firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.child}`).update({ money });
            }

            const record = {
                type: "Reset",
                amount: this.state.value,
                wallet: this.props.walletName,
                date: {
                    year: date.getFullYear(),
                    month: months[date.getMonth()],
                    day: ("0" + date.getDate()).slice(-2),
                    hour: ("0" + date.getHours()).slice(-2),
                    min: ("0" + date.getMinutes()).slice(-2),
                },
            };

            //push record to personal history
            usersRef.child(this.props.authUser.uid).child("history").push(record);

            //push record to group history
            if (this.props.group) {
                const groupRecord = {
                    type: "Reset",
                    user: this.props.authUser.uid,
                    amount: this.state.value,
                    date: {
                        year: date.getFullYear(),
                        month: months[date.getMonth()],
                        day: ("0" + date.getDate()).slice(-2),
                        hour: ("0" + date.getHours()).slice(-2),
                        min: ("0" + date.getMinutes()).slice(-2),
                    },
                }

                firebase.database().ref(`groups/${this.props.child}/history`).push(groupRecord);
            }

            this.props.setSnackbarOpen(true);
            this.setState({ value: "" });
        }
    }

    render() {
        const { intl } = this.props;
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title"><FormattedMessage id="dialogs.reset.title" /></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    <FormattedMessage id="dialogs.reset.text" />
      </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="insert"
                        label={intl.formatMessage({ id: "dialogs.reset.money_amount" })}
                        type="number"
                        fullWidth
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e, "value")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }} color="primary">
                    <FormattedMessage id="dialogs.reset.cancel" />
      </Button>
                    <Button onClick={this.submit} color="primary">
                        <FormattedMessage id="dialogs.reset.reset" />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    state: state.homeState,
    authUser: state.sessionState.authUser,
});

export default injectIntl(connect(mapStateToProps)(ResetDialog));