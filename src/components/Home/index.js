import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
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
import InsertDialog from './insertDialog'
import WithdrawDialog from './withdrawDialog'
import ResetDialog from './resetDialog'
import * as actions from '../../constants/action_types'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    right: "1.8rem",
    bottom: "1.8rem",
    position: "absolute",
  },
  label: {
    right: "2.5rem",
    top: "6.5rem",
    position: "absolute"
  }
});

const usersRef = firebase.database().ref('users/')

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      insert: false,
      withdraw: false,
      reset: false,
    };
  }

  setFirstUse = () => {
    usersRef.child(this.props.authUser.uid).update({ firstUse: false })
    this.props.setFirstUse(false)
  }

  componentDidMount() {
    usersRef.on('child_added', snapshot => {
      if (snapshot.val().firstUse) {
        this.props.setFirstUse(true)
      }
      this.props.loadTotalAmount(snapshot.val().money)
    })
  }

  handleMenuClick = event => {
    this.props.setAnchorEl(event.currentTarget)
  }

  handleOptionClick = (e) => {
    this.props.setModifyOpenDialog(true)
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

  render() {
    const { classes } = this.props
    const { totalAmount, firstUse, anchorEl, open, modifyOpen } = this.props.state

    return (
      <div>

        <h1>My Wallet</h1>
        <span style={{ fontSize: "4rem" }}>{formatNumber({ prefix: "$" })(totalAmount.toFixed(2))}</span>

        <Divider />

        <h1>Records</h1>

        <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button}>
          <Edit />
        </Button>

        {firstUse &&
          <FirstUse open={open} handleClose={this.props.setOpenDialog} setFirstUse={this.setFirstUse} />
        }

        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={e => this.props.setAnchorEl(e.currentTarget)}
          className={classes.label}
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

        {modifyOpen &&
          this.state.insert
          ? <InsertDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} />
          : this.state.withdraw
            ? <WithdrawDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} />
            : this.state.reset
              ? <ResetDialog modifyOpen={modifyOpen} handleClose={this.props.setModifyOpenDialog} />
              : null
        }

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
  loadTotalAmount: (totalAmount) => dispatch({ type: actions.LOAD_TOTAL_AMOUNT, totalAmount }),
  setAnchorEl: (anchorEl) => dispatch({ type: actions.SET_ANCHOR_EL, anchorEl }),
  setOpenDialog: (open) => dispatch({ type: actions.SET_OPEN_DIALOG, open }),
  setModifyOpenDialog: (modifyOpen) => dispatch({ type: actions.SET_MODIFY_OPEN_DIALOG, modifyOpen }),
  setTotalAmount: (operation, amount) => dispatch({ type: actions.SET_TOTAL_AMOUNT, operation, amount })
})

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(HomePage);
