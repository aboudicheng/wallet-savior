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
      firstUse: false,
      open: true,
      totalAmount: 0,
      anchorEl: null,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  setFirstUse = () => {
    usersRef.child(this.props.authUser.uid).update({ firstUse: false })
    this.setState({ firstUse: false })
  }

  componentDidMount() {
    usersRef.on('child_added', snapshot => {
      if (snapshot.val().firstUse) {
        this.setState({ firstUse: true })
      }
      this.setState({ totalAmount: snapshot.val().money })
    })
  }

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { totalAmount, anchorEl } = this.state
    const { classes } = this.props

    //TODO: insert, deposit, reset
    return (
      <div>

        <h1>My Wallet</h1>
        <span style={{ fontSize: "4rem" }}>{formatNumber({ prefix: "$" })(totalAmount.toFixed(2))}</span>

        <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button}>
          <Edit />
        </Button>

        {this.state.firstUse &&
          <FirstUse open={this.state.open} handleClose={this.handleClose} setFirstUse={this.setFirstUse} />
        }

        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleMenuClick}
          className={classes.label}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.handleMenuClose}>Insert</MenuItem>
          <MenuItem onClick={this.handleMenuClose}>Withdraw</MenuItem>
          <MenuItem onClick={this.handleMenuClose}>Reset</MenuItem>
        </Menu>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps),
  withStyles(styles)
)(HomePage);
