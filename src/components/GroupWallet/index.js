import React, { Component } from "react";
import withAuthorization from "../Session/withAuthorization";
import { withRouter } from "react-router";
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

import MembersDialog from "../Operations/membersDialog";
import InviteDialog from "../Operations/inviteDialog";
import InsertDialog from "../Operations/insertDialog";
import WithdrawDialog from "../Operations/withdrawDialog";
import ResetDialog from "../Operations/resetDialog";
import QuitDialog from "../Operations/quitDialog";
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

class GroupWallet extends Component {
    constructor() {
        super();

        this.state = {
            group: null,
            isLoading: true,

            anchorEl: null,

            //used for Menu Dialog
            modifyOpen: false,

            option: {
                members: false,
                invite: false,
                insert: false,
                withdraw: false,
                reset: false,
            },

            quit: false,

            renameOpen: false,

            snackbarOpen: false,
        };

    }

    componentDidMount() {
        firebase.database().ref(`groups/${this.props.match.params.id}`).on("value", (snapshot) => {
            if (snapshot.val()) {
                this.setState({ group: snapshot.val(), isLoading: false });
            }
        });
    }

    componentDidUpdate(props) {
        if (this.props.location.key !== props.location.key) {
            firebase.database().ref(`groups/${this.props.match.params.id}`).on("value", (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ group: snapshot.val(), isLoading: false });
                }
            })
        }
    }

    setAnchorEl = (anchorEl) => {
        this.setState({ anchorEl });
    }

    handleOptionClick = (e) => {
        switch (e.target.dataset.option) {
            case "members":
                this.setState({
                    option: {
                        members: true,
                        invite: false,
                        insert: false,
                        withdraw: false,
                        reset: false,
                        quit: false,
                    },
                    modifyOpen: true
                })
                break;
            case "invite":
                this.setState({
                    option: {
                        members: false,
                        invite: true,
                        insert: false,
                        withdraw: false,
                        reset: false,
                        quit: false,
                    },
                    modifyOpen: true
                })
                break;
            case "insert":
                this.setState({
                    option: {
                        insert: true,
                        invite: false,
                        withdraw: false,
                        reset: false,
                        quit: false,
                    },
                    modifyOpen: true
                })
                break;
            case "withdraw":
                this.setState({
                    option: {
                        insert: false,
                        invite: false,
                        withdraw: true,
                        reset: false,
                        quit: false,
                    },
                    modifyOpen: true
                })
                break;
            case "reset":
                this.setState({
                    option: {
                        insert: false,
                        invite: false,
                        withdraw: false,
                        reset: true,
                        quit: false,
                    },
                    modifyOpen: true
                })
                break;
            case "quit":
                this.setState({
                    option: {
                        insert: false,
                        invite: false,
                        withdraw: false,
                        reset: false,
                        quit: true,
                    },
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
            group,
            isLoading,
            option,
            renameOpen,
            anchorEl,
            modifyOpen,
            snackbarOpen,
        } = this.state;
        const { classes } = this.props;
        return (
            <div>
                {
                    isLoading
                        ? <CircularProgress className={classes.progress} size={50} />
                        :
                        <div>
                            <h1>{group.name}</h1>
                            <span style={{ fontSize: "170%", color: group.money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(group.money).toFixed(2))}</span>

                            <Divider />

                            <Tooltip TransitionComponent={Zoom} title="Edit wallet name">
                                <Button variant="fab" color="secondary" aria-label="Edit" className={classes.editButton} onClick={() => this.setRenameDialog(true)}>
                                    <Edit />
                                </Button>
                            </Tooltip>

                            {/*Dialog popup for rename*/}
                            {renameOpen &&
                                <Rename open={renameOpen} child={group.id} setSnackbarOpen={this.setSnackbarOpen} setRenameDialog={this.setRenameDialog} group={true} />
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
                                <MenuItem data-option="members" onClick={this.handleOptionClick}>Members</MenuItem>
                                <MenuItem data-option="invite" onClick={this.handleOptionClick}>Invite</MenuItem>
                                <MenuItem data-option="insert" onClick={this.handleOptionClick}>Insert</MenuItem>
                                <MenuItem data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</MenuItem>
                                <MenuItem data-option="reset" onClick={this.handleOptionClick}>Reset</MenuItem>
                                <MenuItem data-option="quit" onClick={this.handleOptionClick}>Quit</MenuItem>
                            </Menu>

                            <div className="menubar">
                                <Button className={classes.menuButton} color="default" data-option="members" onClick={this.handleOptionClick}><span data-option="members" onClick={this.handleOptionClick}>Members</span></Button>
                                <Button className={classes.menuButton} color="default" data-option="invite" onClick={this.handleOptionClick}><span data-option="invite" onClick={this.handleOptionClick}>Invite</span></Button>
                                <Button className={classes.menuButton} color="default" data-option="insert" onClick={this.handleOptionClick}><span data-option="insert" onClick={this.handleOptionClick}>Insert</span></Button>
                                <Button className={classes.menuButton} color="default" data-option="withdraw" onClick={this.handleOptionClick}><span data-option="withdraw" onClick={this.handleOptionClick}>Withdraw</span></Button>
                                <Button className={classes.menuButton} color="default" data-option="reset" onClick={this.handleOptionClick}><span data-option="reset" onClick={this.handleOptionClick}>Reset</span></Button>
                                <Button className={classes.menuButton} color="default" data-option="quit" onClick={this.handleOptionClick}><span data-option="quit" onClick={this.handleOptionClick}>Quit</span></Button>
                            </div>

                            {/*Operation Dialogs*/}
                            {modifyOpen &&
                                option.members
                                ? <MembersDialog open={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} groupId={group.id} addMember={this.handleOptionClick} />
                                : option.invite
                                    ? <InviteDialog open={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} groupId={group.id} groupName={group.name} setSnackbarOpen={this.setSnackbarOpen} />
                                    : option.insert
                                        ? <InsertDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={group.name} totalAmount={group.money} child={group.id} setSnackbarOpen={this.setSnackbarOpen} group={true} />
                                        : option.withdraw
                                            ? <WithdrawDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={group.name} totalAmount={group.money} child={group.id} setSnackbarOpen={this.setSnackbarOpen} group={true} />
                                            : option.reset
                                                ? <ResetDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} walletName={group.name} child={group.id} setSnackbarOpen={this.setSnackbarOpen} group={true} />
                                                : <QuitDialog modifyOpen={modifyOpen} handleClose={this.setModifyOpenDialog} handleMenuClose={this.setAnchorEl} child={group.id} setSnackbarOpen={this.setSnackbarOpen} group={true} />
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
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
    connect(mapStateToProps),
    withAuthorization(authCondition),
    withStyles(styles),
    withRouter,
)(GroupWallet);