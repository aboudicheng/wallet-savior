import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import classNames from "classnames";
import FirstUse from "./firstUseDialog";
import withAuthorization from "../Session/withAuthorization";
import firebase from "firebase/app";
import formatNumber from "format-number";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { FormattedMessage, injectIntl } from "react-intl";
import * as routes from "../../constants/routes";

import InsertDialog from "../Operations/insertDialog";
import WithdrawDialog from "../Operations/withdrawDialog";
import ResetDialog from "../Operations/resetDialog";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";
import Rename from "../Operations/rename";

const styles = (theme) => ({
  editButton: {
    margin: theme.spacing.unit,
    right: "1.8rem",
    bottom: "1.8rem",
    position: "fixed",
  },
  label: {
    right: "0.5rem",
    top: "0.2rem",
    position: "absolute",
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  menuButton: {
    color: "#3fb5a3",
  }
});

const usersRef = firebase.database().ref("users/");

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      firstUse: false,

      //used for firstUSe Dialog
      open: true,
      walletName: "",
      totalAmount: parseFloat(0).toFixed(2),
      anchorEl: null,

      //used for Menu Dialog
      modifyOpen: false,

      renameOpen: false,

      snackbarOpen: false,

      insert: false,
      withdraw: false,
      reset: false,
      isLoading: true,
    };
  }

  setFirstUse = () => {
    usersRef.child(this.props.authUser.uid).update({ firstUse: false });
    this.setState({ firstUse: false });
  }

  componentDidMount() {
    usersRef.child(this.props.authUser.uid).on("value", (snapshot) => {
      if (snapshot.val().firstUse) {
        this.setState({ firstUse: true });
      }
      this.setState({ isLoading: false, walletName: snapshot.val().wallets[0].name, totalAmount: snapshot.val().wallets[0].money });
    });
  }

  setAnchorEl = (anchorEl) => {
    this.setState({ anchorEl });
  }

  handleMenuClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleOptionClick = (e) => {
    switch (e.target.dataset.option) {
      case "insert":
        this.setState({ insert: true, withdraw: false, reset: false, modifyOpen: true });
        break;
      case "withdraw":
        this.setState({ insert: false, withdraw: true, reset: false, modifyOpen: true });
        break;
      case "reset":
        this.setState({ insert: false, withdraw: false, reset: true, modifyOpen: true });
        break;
      default: return;
    }
  }

  setModifyOpenDialog = (modifyOpen) => {
    this.setState({ modifyOpen });
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  setOpenDialog = (open) => {
    this.setState({ open });
  }

  setSnackbarOpen = (snackbarOpen) => {
    this.setState({ snackbarOpen });
  }

  setRenameDialog = (renameOpen) => {
    this.setState({ renameOpen });
  }

  render() {
    const { classes, intl } = this.props;
    const {
      walletName,
      totalAmount,
      isLoading,
      firstUse,
      insert,
      withdraw,
      reset,
      anchorEl,
      open,
      modifyOpen,
      snackbarOpen,
      renameOpen
    } = this.state;

    if (isLoading)
      return <CircularProgress className={classes.progress} size={50} />

    return (
      <div>

        <h1>{walletName}</h1>
        <div className="wallet" style={{ fontSize: "170%", fontWeight: "bold", backgroundColor: totalAmount >= 0 ? "#3fb5a3" : "#c93e3e" }}>{formatNumber({ prefix: "$" })(parseFloat(totalAmount).toFixed(2))}</div>

        <p><FormattedMessage id="home.check" /> <Link to={routes.HISTORY}><FormattedMessage id="home.history" /></Link></p>
        <Divider />

        <Tooltip TransitionComponent={Zoom} title={intl.formatMessage({ id: "home.edit_wallet_name" })}>
          <Button variant="fab" color="secondary" aria-label="Edit" className={classes.editButton} onClick={() => this.setRenameDialog(true)}>
            <Edit />
          </Button>
        </Tooltip>

        {/*Dialog popup for rename*/}
        {renameOpen &&
          <Rename open={renameOpen} child={0} setSnackbarOpen={this.setSnackbarOpen} setRenameDialog={this.setRenameDialog} />
        }

        {/*Dialog popup for first-time users*/}
        {firstUse &&
          <FirstUse open={open} handleClose={this.setOpenDialog} setFirstUse={this.setFirstUse} />
        }

        {/*Menu Bar at top right corner*/}
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : null}
          aria-haspopup="true"
          onClick={(e) => this.setAnchorEl(e.currentTarget)}
          className={classNames("menuicon", classes.label)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.setAnchorEl(null)}
        >
          <MenuItem data-option="insert" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.insert" })}</MenuItem>
          <MenuItem data-option="withdraw" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.withdraw" })}</MenuItem>
          <MenuItem data-option="reset" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.reset" })}</MenuItem>
        </Menu>

        <div className="menubar">
          <Button className={classes.menuButton} color="default" data-option="insert" onClick={this.handleOptionClick}><span data-option="insert" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.insert" })}</span></Button>
          <Button className={classes.menuButton} color="default" data-option="withdraw" onClick={this.handleOptionClick}><span data-option="withdraw" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.withdraw" })}</span></Button>
          <Button className={classes.menuButton} color="default" data-option="reset" onClick={this.handleOptionClick}><span data-option="reset" onClick={this.handleOptionClick}>{intl.formatMessage({ id: "operations.reset" })}</span></Button>
        </div>

        {/*Operation Dialogs*/}
        {modifyOpen &&
          insert
          ? <InsertDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={walletName} totalAmount={totalAmount} child={0} setSnackbarOpen={this.setSnackbarOpen} />
          : withdraw
            ? <WithdrawDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={walletName} totalAmount={totalAmount} child={0} setSnackbarOpen={this.setSnackbarOpen} />
            : reset
              ? <ResetDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={walletName} child={0} setSnackbarOpen={this.setSnackbarOpen} />
              : null
        }

        {/*Snackbar poppup*/}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant="success"
            message={intl.formatMessage({ id: "operations.operation_successful"})}
          />
        </Snackbar>
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
  withStyles(styles),
  withRouter,
  injectIntl
)(HomePage);
