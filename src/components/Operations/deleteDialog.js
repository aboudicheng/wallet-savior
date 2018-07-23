import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as firebase from 'firebase/app'
import * as routes from '../../constants/routes';

class DeleteDialog extends Component {

    delete = () => {
        this.props.history.push(routes.HOME)
        if (this.props.group) {
            //delete both from the groups field and user's groups field
            firebase.database().ref(`groups/${this.props.child}`).remove()
            firebase.database().ref(`users/${this.props.authUser.uid}/groups/${this.props.child}`).remove() 
        }
        else {
            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.child}`).remove()
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.modifyOpen}
                onClose={() => this.props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Wallet"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You won't be able to undo once you delete your wallet. Are you sure to delete it?
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
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    connect(mapStateToProps),
    withRouter
)(DeleteDialog);