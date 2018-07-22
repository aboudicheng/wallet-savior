import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase/app'
import * as actions from '../../constants/action_types'
import { months } from '../../constants/months'

const usersRef = firebase.database().ref('users/')

class InsertDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
            text: "",
        }
    }

    handleChange = (e, prop) => {
        this.setState({ [prop]: e.target.value })
    }

    submit = () => {
        if (this.state.value !== "" && !isNaN(this.state.value)) {
            const date = new Date();

            this.props.handleClose(false);
            this.props.handleMenuClose(null);
            this.props.setTotalAmount("insert", this.state.value)
            const previousTotalAmount = parseFloat(this.props.totalAmount)
            const newValue = parseFloat(this.state.value)

            const money = parseFloat(previousTotalAmount + newValue).toFixed(2)

            usersRef.child(this.props.authUser.uid).child("wallets").child(0).update({ money })

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
            }

            usersRef.child(this.props.authUser.uid).child("history").push(record)

            this.props.setSnackbarOpen(true);
            this.setState({ value: "", text: "" })
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.modifyOpen}
                    onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add Money</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the amount of money you are going add to your wallet:
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
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description (optional)"
                            type="text"
                            fullWidth
                            value={this.state.text}
                            onChange={(e) => this.handleChange(e, "text")}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }} color="primary">
                            Cancel
      </Button>
                        <Button onClick={this.submit} color="primary">
                            Add
      </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

const mapDispatchToProps = (dispatch) => ({
    setSnackbarOpen: (snackbarOpen) => dispatch({ type: actions.SET_SNACKBAR_OPEN, snackbarOpen })
})

export default connect(mapStateToProps, mapDispatchToProps)(InsertDialog);