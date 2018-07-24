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

class Invite extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
            error: null,
        }
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value })
    }

    submit = () => {
        if (this.state.value !== "") {
            const usersRef = firebase.database().ref('users')
            const membersRef = firebase.database().ref(`groups/${this.props.groupId}/member`) 
            this.setState({ error: null })
            let found = false

            usersRef.once('value', snapshot => {

                for (let key in snapshot.val()) {
                    if (snapshot.val()[key].email === this.state.value) {
                        found = true

                        //iterate through member id
                        membersRef.once('value', s => {
                            if (s.val().includes(key)) {
                                this.setState({ error: "The member is already in the group!" })
                            }
                            else {
                                //push to groups field
                                membersRef.child(s.val().length).set(key)

                                //also push to personal groups field
                                usersRef.child(`${key}/groups/${this.props.groupId}`).set({ name: this.props.groupName, id: this.props.groupId })

                                this.props.handleClose(false);
                                this.props.handleMenuClose(null);
                            }
                        })

                    }
                }

                if (!found) {
                    this.setState({ error: "User not found!" })
                }
            })

            //this.props.setSnackbarOpen(true);
        }
    }

    render() {
        const { error } = this.state
        return (
            <Dialog
                open={this.props.open}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the email of the user you would like to add in:
      </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="text"
                        fullWidth
                        value={this.state.value}
                        onChange={this.handleChange}
                    />

                    {error && <span style={{ color: "red" }}>{error}</span>}

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
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default connect(mapStateToProps)(Invite);