import React, { Component } from "react";
//import withAuthorization from "../Session/withAuthorization";
import { connect } from "react-redux";
import { compose } from "recompose";
import classNames from "classnames";
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
import * as routes from "../../constants/routes";

import InsertDialog from "../Operations/insertDialog";
import WithdrawDialog from "../Operations/withdrawDialog";
import ResetDialog from "../Operations/resetDialog";
import DeleteDialog from "../Operations/deleteDialog";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";
import Rename from "../Operations/rename";

//TODO: add withAuthorization

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

class NewWallet extends Component {
    constructor() {
        super();

        this.state = {
            wallet: null,
            isLoading: true,

            anchorEl: null,

            //used for Menu Dialog
            modifyOpen: false,
            insert: false,
            withdraw: false,
            reset: false,
            delete: false,

            renameOpen: false,

            snackbarOpen: false,
        };

    }

    componentDidMount() {
        //if user access via history.push or pressing back button
        if (this.props.history.action === "PUSH" || this.props.authUser) {
            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.match.params.id}`).on("value", (snapshot) => {
                if (snapshot.val()) {
                    this.setState({
                        wallet: snapshot.val(),
                        isLoading: false
                    });
                }
            })
        }
    }

    componentDidUpdate(props) {
        /*if user transtitions between extra wallets then componentDidMount won"t get called*/
        //Wait until it gets authUser info
        if ((this.props.location.key !== props.location.key) || this.state.isLoading) {
            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.match.params.id}`).on("value", (snapshot) => {
                this.setState({
                    wallet: snapshot.val(),
                    isLoading: false
                })
            })
        }
    }

    setAnchorEl = (anchorEl) => {
        this.setState({ anchorEl });
    }

    handleOptionClick = (e) => {
        switch (e.target.dataset.option) {
            case "insert":
                this.setState({
                    insert: true,
                    withdraw: false,
                    reset: false,
                    delete: false,
                    modifyOpen: true
                })
                break;
            case "withdraw":
                this.setState({
                    insert: false,
                    withdraw: true,
                    reset: false,
                    delete: false,
                    modifyOpen: true
                })
                break;
            case "reset":
                this.setState({
                    insert: false,
                    withdraw: false,
                    reset: true,
                    delete: false,
                    modifyOpen: true
                })
                break;
            case "delete":
                this.setState({
                    insert: false,
                    withdraw: false,
                    reset: false,
                    delete: true,
                    modifyOpen: true
                })
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

    setSnackbarOpen = (snackbarOpen) => {
        this.setState({ snackbarOpen });
    }

    setRenameDialog = (renameOpen) => {
        this.setState({ renameOpen });
    }

    render() {
        const {
            wallet,
            isLoading,
            insert,
            withdraw,
            reset,
            renameOpen,
            anchorEl,
            modifyOpen,
            snackbarOpen,
        } = this.state;
        const { classes } = this.props;

        if (isLoading)
            return <CircularProgress className={classes.progress} size={50} />;

        return (
            <div>
                <h1>{wallet.name}</h1>
                <div className="wallet" style={{ fontSize: "170%", backgroundColor: wallet.money >= 0 ? "#3fb5a3" : "#c93e3e" }}>{formatNumber({ prefix: "$" })(parseFloat(wallet.money).toFixed(2))}</div>

                <p>Check <Link to={routes.HISTORY}>History</Link></p>
                <Divider />

                <Tooltip TransitionComponent={Zoom} title="Edit wallet name">
                    <Button variant="fab" color="secondary" aria-label="Edit" className={classes.editButton} onClick={() => this.setRenameDialog(true)}>
                        <Edit />
                    </Button>
                </Tooltip>

                {/*Dialog popup for rename*/}
                {renameOpen &&
                    <Rename open={renameOpen} child={wallet.id} setSnackbarOpen={this.setSnackbarOpen} setRenameDialog={this.setRenameDialog} />
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
                    <MenuItem data-option="insert" onClick={this.handleOptionClick}>Insert</MenuItem>
                    <MenuItem data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</MenuItem>
                    <MenuItem data-option="reset" onClick={this.handleOptionClick}>Reset</MenuItem>
                    <MenuItem data-option="delete" onClick={this.handleOptionClick}>Delete</MenuItem>
                </Menu>

                <div className="menubar">
                    <Button className={classes.menuButton} color="default" data-option="insert" onClick={this.handleOptionClick}><span data-option="insert" onClick={this.handleOptionClick}>Insert</span></Button>
                    <Button className={classes.menuButton} color="default" data-option="withdraw" onClick={this.handleOptionClick}><span data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</span></Button>
                    <Button className={classes.menuButton} color="default" data-option="reset" onClick={this.handleOptionClick}><span data-option="reset" onClick={this.handleOptionClick}>Reset</span></Button>
                    <Button className={classes.menuButton} color="default" data-option="delete" onClick={this.handleOptionClick}><span data-option="delete" onClick={this.handleOptionClick}>Delete</span></Button>
                </div>

                {/*Operation Dialogs*/}
                {modifyOpen &&
                    insert
                    ? <InsertDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={wallet.name} totalAmount={wallet.money} child={wallet.id} setSnackbarOpen={this.setSnackbarOpen} />
                    : withdraw
                        ? <WithdrawDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={wallet.name} totalAmount={wallet.money} child={wallet.id} setSnackbarOpen={this.setSnackbarOpen} />
                        : reset
                            ? <ResetDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={wallet.name} child={wallet.id} setSnackbarOpen={this.setSnackbarOpen} />
                            : <DeleteDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} child={wallet.id} setSnackbarOpen={this.setSnackbarOpen} />
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
                        message="Operation successful!"
                    />
                </Snackbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

//const authCondition = (authUser) => !!authUser;

//withAuthorization doesn"t work properly
export default compose(
    withRouter,
    connect(mapStateToProps),
    //withAuthorization(authCondition),
    withStyles(styles),

)(NewWallet);