import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import * as firebase from 'firebase/app'
//import { months } from '../../constants/months'

class ResetDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
        }
    }

    handleChange = (e, prop) => {
        this.setState({ [prop]: e.target.value })
    }

    submit = () => {
        if (this.state.value.length !== 0 && !isNaN(this.state.value)) {
            //const date = new Date();

            this.props.handleClose(false);
            this.props.handleMenuClose(null);
            this.props.setTotalAmount("reset", this.state.value)

            const money = parseFloat(this.state.value).toFixed(2)

            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.child}`).update({ money })

            // const record = {
            //     type: "Reset",
            //     amount: this.state.value,
            //     wallet: "Personal",
            //     date: {
            //         year: date.getFullYear(),
            //         month: months[date.getMonth()],
            //         day: ("0" + date.getDate()).slice(-2),
            //         hour: ("0" + date.getHours()).slice(-2),
            //         min: ("0" + date.getMinutes()).slice(-2),
            //     },
            //     description: this.state.text
            // }

            // usersRef.child(this.props.authUser.uid).child("history").push(record)

            this.props.setSnackbarOpen(true);
            this.setState({ value: "", text: "" })
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Reset Wallet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the amount of money you are going to initialize for your wallet:
      </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="insert"
                        label="Money amount"
                        type="number"
                        fullWidth
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e, "value")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }} color="primary">
                        Cancel
      </Button>
                    <Button onClick={this.submit} color="primary">
                        Reset
      </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    state: state.homeState,
    authUser: state.sessionState.authUser,
})

export default connect(mapStateToProps)(ResetDialog);