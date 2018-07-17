import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import * as firebase from 'firebase'
import * as actions from '../../constants/action_types'

class WithdrawDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
        }
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value })
    }

    submit = () => {
        if (this.state.value !== "" && !isNaN(this.state.value)) {
            this.props.handleClose(false);
            this.props.handleMenuClose(null);
            this.props.setTotalAmount("withdraw", this.state.value)

            const previousTotalAmount = parseFloat(this.props.state.totalAmount)
            const newValue = parseFloat(this.state.value)

            const money = parseFloat(previousTotalAmount - newValue).toFixed(2)

            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/0`).update({ money })
            this.props.setSnackbarOpen(true);
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Withdraw Money</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the amount of money you are going to take out from your wallet:
      </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="withdraw"
                        label="Money amount"
                        type="number"
                        fullWidth
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }} color="primary">
                        Cancel
      </Button>
                    <Button onClick={this.submit} color="primary">
                        Withdraw
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

const mapDispatchToProps = (dispatch) => ({
    setSnackbarOpen: (snackbarOpen) => dispatch({ type: actions.SET_SNACKBAR_OPEN, snackbarOpen })
})

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawDialog);