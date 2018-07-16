import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const ResetDialog = (props) =>
    <Dialog
        open={props.modifyOpen}
        onClose={() => props.handleClose(false)}
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
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.handleClose(false)} color="primary">
                Cancel
  </Button>
            <Button onClick={() => props.handleClose(false)} color="primary">
                Reset
  </Button>
        </DialogActions>
    </Dialog>

export default ResetDialog;