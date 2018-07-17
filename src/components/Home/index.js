import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classNames from 'classnames';
import FirstUse from './firstUseDialog'
import withAuthorization from '../Session/withAuthorization';
import firebase from 'firebase';
import formatNumber from "format-number";
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import InsertDialog from './insertDialog'
import WithdrawDialog from './withdrawDialog'
import ResetDialog from './resetDialog'
import * as actions from '../../constants/action_types'
import MySnackbarContentWrapper from './styles/MySnackbarContentWrapper'
import Rename from './rename'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    right: "1.8rem",
    bottom: "1.8rem",
    position: "absolute",
  },
  label: {
    right: "0.5rem",
    top: "0.2rem",
    position: "absolute",
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const usersRef = firebase.database().ref('users/')

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      insert: false,
      withdraw: false,
      reset: false,
      isLoading: true,
    };
  }

  setFirstUse = () => {
    usersRef.child(this.props.authUser.uid).update({ firstUse: false })
    this.props.setFirstUse(false)
  }

  componentDidMount() {
    usersRef.child(this.props.authUser.uid).on('value', snapshot => {
      if (snapshot.val().firstUse) {
        this.props.setFirstUse(true)
      }
      this.setState({ isLoading: false })
      this.props.loadWalletName(snapshot.val().wallets[0].name)
      this.props.loadTotalAmount(snapshot.val().wallets[0].money)
    })
  }

  handleMenuClick = event => {
    this.props.setAnchorEl(event.currentTarget)
  }

  handleOptionClick = (e) => {
    this.props.setModifyOpenDialog(true)
    console.log(e.target)
    switch (e.target.dataset.option) {
      case "insert":
        this.setState({ insert: true, withdraw: false, reset: false })
        break;
      case "withdraw":
        this.setState({ insert: false, withdraw: true, reset: false })
        break;
      case "reset":
        this.setState({ insert: false, withdraw: false, reset: true })
        break;
      default: return;
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.setSnackbarOpen(false)
  };

  handleRenameOpen = (renameOpen) => {
    this.props.setRenameDialog(renameOpen)
  }

  render() {
    const { classes } = this.props
    const {
      walletName,
      totalAmount,
      firstUse,
      anchorEl,
      open,
      modifyOpen,
      snackbarOpen,
      renameOpen
    } = this.props.state

    return (
      <div>

        <h1>{walletName}</h1>
        {this.state.isLoading
          ? <CircularProgress className={classes.progress} size={50} />
          : <span style={{ fontSize: "170%", color: totalAmount > 0 ? "#00ff00" : "#ff0000" }}>{formatNumber({ prefix: "$" })(totalAmount)}</span>
        }
        <Divider />

        <Tooltip TransitionComponent={Zoom} title="Edit wallet name">
          <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button} onClick={() => this.handleRenameOpen(true)}>
            <Edit />
          </Button>
        </Tooltip>

        {/*Dialog popup for rename*/}
        {renameOpen &&
          <Rename open={renameOpen} handleClose={this.props.setRenameDialog} setNewName={this.props.setNewName} />
        }

        {/*Dialog popup for first-time users*/}
        {firstUse &&
          <FirstUse open={open} handleClose={this.props.setOpenDialog} setFirstUse={this.setFirstUse} />
        }

        {/*Menu Bar at top right corner*/}
        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={e => this.props.setAnchorEl(e.currentTarget)}
          className={classNames("menuicon", classes.label)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.props.setAnchorEl(null)}
        >
          <MenuItem data-option="insert" onClick={this.handleOptionClick}>Insert</MenuItem>
          <MenuItem data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</MenuItem>
          <MenuItem data-option="reset" onClick={this.handleOptionClick}>Reset</MenuItem>
        </Menu>

        <div className="menubar">
          <Button color="default" data-option="insert" onClick={this.handleOptionClick}><span data-option="insert" onClick={this.handleOptionClick}>Insert</span></Button>
          <Button color="default" data-option="withdraw" onClick={this.handleOptionClick}><span data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</span></Button>
          <Button color="default" data-option="reset" onClick={this.handleOptionClick}><span data-option="reset" onClick={this.handleOptionClick}>Reset</span></Button>
        </div>

        {/*Operation Dialogs*/}
        {modifyOpen &&
          this.state.insert
          ? <InsertDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} handleMenuClose={this.props.setAnchorEl} setTotalAmount={this.props.setTotalAmount} />
          : this.state.withdraw
            ? <WithdrawDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} handleMenuClose={this.props.setAnchorEl} setTotalAmount={this.props.setTotalAmount} />
            : this.state.reset
              ? <ResetDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} handleMenuClose={this.props.setAnchorEl} setTotalAmount={this.props.setTotalAmount} />
              : null
        }

        {/*Snackbar poppup*/}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant="success"
            message="Operation successful!"
          />
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  state: state.homeState,
});

const mapDispatchToProps = (dispatch) => ({
  setFirstUse: (firstUse) => dispatch({ type: actions.SET_FIRST_USE, firstUse }),
  loadWalletName: (walletName) => dispatch({ type: actions.LOAD_WALLET_NAME, walletName }),
  loadTotalAmount: (totalAmount) => dispatch({ type: actions.LOAD_TOTAL_AMOUNT, totalAmount }),
  setAnchorEl: (anchorEl) => dispatch({ type: actions.SET_ANCHOR_EL, anchorEl }),
  setOpenDialog: (open) => dispatch({ type: actions.SET_OPEN_DIALOG, open }),
  setModifyOpenDialog: (modifyOpen) => dispatch({ type: actions.SET_MODIFY_OPEN_DIALOG, modifyOpen }),
  setTotalAmount: (operation, amount) => dispatch({ type: actions.SET_TOTAL_AMOUNT, payload: { operation, amount } }),
  setNewName: (name) => dispatch({ type: actions.SET_NEW_NAME, name }),
  setRenameDialog: (open) => dispatch({ type: actions.SET_RENAME_DIALOG, open }),
  setSnackbarOpen: (snackbarOpen) => dispatch({ type: actions.SET_SNACKBAR_OPEN, snackbarOpen })
})

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(HomePage);
