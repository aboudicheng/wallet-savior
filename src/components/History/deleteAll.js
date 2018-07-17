import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteAll = (props) =>
    <Dialog
        open={props.open}
        onClose={() => props.handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Delete all history"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure to delete all history?
      </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.handleClose(false)} color="primary">
                No
      </Button>
            <Button onClick={() => { props.deleteHistory(); props.handleClose(false) }} color="primary">
                Yes
      </Button>
        </DialogActions>
    </Dialog>

export default DeleteAll;