import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";

const DeleteAll = (props) =>
    <Dialog
        open={props.open}
        onClose={() => props.handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title"><FormattedMessage id="history.delete_all" /></DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                <FormattedMessage id="history.text" />
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.handleClose(false)} color="primary">
                <FormattedMessage id="history.no" />
            </Button>
            <Button onClick={() => { props.deleteHistory(); props.handleClose(false); props.setSnackbar(true); }} color="primary">
                <FormattedMessage id="history.yes" />
            </Button>
        </DialogActions>
    </Dialog>;

export default DeleteAll;