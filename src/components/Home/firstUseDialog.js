import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const FirstUse = (props) =>
    <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Welcome to Wallet $avior!"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You will now be able to keep track of your own expenditures as well as any organization you belong to. Feel free to form your own groups and invite your friends in!
      </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { props.handleClose(); props.setFirstUse() }} color="primary" autoFocus>
                Alright!
      </Button>
        </DialogActions>
    </Dialog>

export default FirstUse;