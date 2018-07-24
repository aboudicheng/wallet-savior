import React, { Component } from 'react'
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import * as firebase from 'firebase/app';

class Create extends Component {
    constructor() {
        super();

        this.state = {
            name: ""
        }
    }

    handleChange = (e) => {
        this.setState({ name: e.target.value })
    }

    submit = () => {
        this.props.handleClose(false)
        this.props.toggleDrawer(false)

        if (this.props.option === 'wallet') {
            const walletRef = firebase.database().ref(`users/${this.props.authUser.uid}/wallets/`)

            const wallet = {
                name: this.state.name,
                money: 0,
            }

            //push wallet into user's wallet field
            const newWallet = walletRef.push(wallet)

            walletRef.child(newWallet.key).set({ ...wallet, id: newWallet.key })

            this.props.history.push(`/wallets/${newWallet.key}`)
        }
        else {
            const groupsRef = firebase.database().ref('groups/')
            const userGroupRef = firebase.database().ref(`users/${this.props.authUser.uid}/groups/`)

            const group = {
                name: this.state.name,
                member: [this.props.authUser.uid],
                money: 0,
            }

            //push group info into group field
            const newGroupRef = groupsRef.push(group)
            groupsRef.child(newGroupRef.key).set({ ...group, id: newGroupRef.key })

            //push group info into personal field
            userGroupRef.child(newGroupRef.key).set({ name: this.state.name, id: newGroupRef.key })

            //direct to its URL
            this.props.history.push(`/groups/${newGroupRef.key}`)
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={() => this.props.handleClose(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {this.props.option === "wallet"
                        ? "Create a Wallet"
                        : "Create a Group"
                    }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.option === "wallet"
                            ? "Please provide a name for this wallet:"
                            : "Please provide a name for this group:"
                        }
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rename"
                        label="Name"
                        type="text"
                        fullWidth
                        value={this.state.name}
                        onChange={this.handleChange}
                    />

                    {/* {error && <span style={{ color: "red" }}>{error}</span>} */}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.handleClose(false)} color="primary">
                        Cancel
  </Button>
                    <Button onClick={this.submit} color="primary">
                        Create
  </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    withRouter,
    connect(mapStateToProps)
)(Create);