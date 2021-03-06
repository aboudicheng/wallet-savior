import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import { FormattedMessage, injectIntl } from "react-intl";
import { months } from "../../constants/months";

const usersRef = firebase.database().ref("users/");

class InsertDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            text: "",
        };
    }

    handleChange = (e, prop) => {
        this.setState({ [prop]: e.target.value });
    }

    submit = () => {
        if (this.state.value !== "" && !isNaN(this.state.value)) {
            const date = new Date();

            this.props.handleClose(false);
            this.props.handleMenuClose(null);
            const previousTotalAmount = parseFloat(this.props.totalAmount);
            const newValue = parseFloat(this.state.value);

            const money = parseFloat(previousTotalAmount + newValue).toFixed(2);

            if (this.props.group) {
                firebase.database().ref(`groups/${this.props.child}`).update({ money });
            }
            else {
                firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.child}`).update({ money });
            }

            const record = {
                type: "Insert",
                amount: this.state.value,
                wallet: this.props.walletName,
                date: {
                    year: date.getFullYear(),
                    month: months[date.getMonth()],
                    day: ("0" + date.getDate()).slice(-2),
                    hour: ("0" + date.getHours()).slice(-2),
                    min: ("0" + date.getMinutes()).slice(-2),
                },
                description: this.state.text
            };

            //push record to personal history
            usersRef.child(this.props.authUser.uid).child("history").push(record);

            //push record to group history
            if (this.props.group) {
                const groupRecord = {
                    type: "Insert",
                    user: this.props.authUser.uid,
                    amount: this.state.value,
                    date: {
                        year: date.getFullYear(),
                        month: months[date.getMonth()],
                        day: ("0" + date.getDate()).slice(-2),
                        hour: ("0" + date.getHours()).slice(-2),
                        min: ("0" + date.getMinutes()).slice(-2),
                    },
                    description: this.state.text
                }

                firebase.database().ref(`groups/${this.props.child}/history`).push(groupRecord);
            }

            this.props.setSnackbarOpen(true);
            this.setState({ value: "", text: "" });
        }
    }

    render() {
        const { intl } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.modifyOpen}
                    onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title"><FormattedMessage id="dialogs.insert.title" /></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <FormattedMessage id="dialogs.insert.text" />
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="insert"
                            label={intl.formatMessage({ id: "dialogs.insert.money_amount" })}
                            type="number"
                            fullWidth
                            value={this.state.value}
                            onChange={(e) => this.handleChange(e, "value")}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label={intl.formatMessage({ id: "dialogs.insert.description" })}
                            type="text"
                            fullWidth
                            value={this.state.text}
                            onChange={(e) => this.handleChange(e, "text")}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }} color="primary">
                            <FormattedMessage id="dialogs.insert.cancel" />
                        </Button>
                        <Button onClick={this.submit} color="primary">
                            <FormattedMessage id="dialogs.insert.insert" />
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

export default injectIntl(connect(mapStateToProps)(InsertDialog));