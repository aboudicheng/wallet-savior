import React, { Component } from 'react'
import { compose } from 'recompose';
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

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
            this.props.history.push(`wallets/${this.state.name}`)
        }
        else {
            this.props.history.push(`group/${this.state.name}`)
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

export default compose(
    withRouter,
)(Create);