import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router";
import formatNumber from "format-number";
import { auth } from "../../firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Home from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/Settings";
import Language from "@material-ui/icons/Language";
import Group from "@material-ui/icons/Group";
import Exit from "@material-ui/icons/ExitToApp";
import RadioButtonChecked from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import AddCircle from "@material-ui/icons/AddCircleOutline";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import History from "@material-ui/icons/History";
import GroupWork from "@material-ui/icons/GroupWork";
import Money from "@material-ui/icons/MonetizationOn";
import { FormattedMessage, injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import * as routes from "../../constants/routes";
import * as firebase from "firebase/app";
import Create from "./create";
import * as actions from "../../constants/action_types";

//Language messages
import { EN } from "../../Languages/en";
import { ZH_TW } from "../../Languages/zh-TW";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    drawer: {
        overflowY: "auto"
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class NavigationAuth extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            walletOpen: false,
            groupOpen: false,
            languageOpen: false,
            mainWallet: "",
            dialog: false,
            option: "",
            wallets: [],
            groupWallets: [],
        };
    }

    componentDidMount() {
        firebase.database().ref(`users/${this.props.authUser.uid}`).on("value", (snapshot) => {
            if (firebase.auth().currentUser) {
                const { groups, wallets } = snapshot.val();
                let groupWallets = [];

                for (let key in groups) {
                    firebase.database().ref("groups/").once("value", (s) => {
                        groupWallets.push(s.val()[groups[key].id]);
                    });
                }

                const newWallets = _.values(wallets);

                this.setState({
                    wallets: newWallets,
                    groupWallets,
                });
            }
        })
    }

    toggleDrawer = (open) => {
        this.setState({ open });
    };

    toggleOption = (e, option) => {
        if (option === "wallet") {
            this.setState((state) => ({ walletOpen: !state.walletOpen }));
        }
        else if (option === "group") {
            this.setState((state) => ({ groupOpen: !state.groupOpen }));
        }
        else {
            this.setState((state) => ({ languageOpen: !state.languageOpen }));
        }
    };

    redirect = (route) => {
        this.setState({ open: false });
        this.props.history.push(route);
    }

    signOut = () => {
        auth.doSignOut();
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/connected`).remove()
    }

    setDialog = (open, option) => {
        if (!open) {
            this.setState({ dialog: open, option: "" });
        }
        else {
            this.setState({ dialog: open, option });
        }
    }

    render() {
        const { classes, intl, language } = this.props;
        const {
            open,
            walletOpen,
            groupOpen,
            languageOpen,
            dialog,
            option,
            wallets,
            groupWallets
        } = this.state;

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={(e) => this.toggleOption(e, "wallet")}><ListItemIcon><Home style={{ color: "#2ecc71" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.personal" })} />{walletOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                {wallets.length > 0 &&
                    <Collapse in={walletOpen} timeout="auto" unmountOnExit>
                        <List>
                            <ListItem button onClick={() => this.redirect(routes.HOME)}>
                                <ListItemIcon>
                                    <Money style={{ color: "#f39c12" }} />
                                </ListItemIcon>
                                <ListItemText primary={wallets[0].name} />
                                <span style={{ color: wallets[0].money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(wallets[0].money).toFixed(2))}</span>
                            </ListItem>
                        </List>
                    </Collapse>
                }
                {wallets.slice(1).map((wallet, i) =>
                    <Collapse in={walletOpen} timeout="auto" unmountOnExit key={`wallets${i}`}>
                        <List>
                            <ListItem button onClick={() => this.redirect(`/wallets/${wallet.id}`)}>
                                <ListItemIcon>
                                    <Money style={{ color: "#f39c12" }} />
                                </ListItemIcon>
                                <ListItemText primary={wallet.name} />
                                <span style={{ color: wallet.money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(wallet.money).toFixed(2))}</span>
                            </ListItem>
                        </List>
                    </Collapse>
                )}

                {/*Add wallet*/}
                <Collapse in={walletOpen} timeout="auto" unmountOnExit>
                    <List><ListItem button onClick={() => this.setDialog(true, "wallet")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.add_wallet" })} /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={(e) => this.toggleOption(e, "group")}><ListItemIcon><Group style={{ color: "#2980b9" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.group" })} />{groupOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                {groupWallets.length > 0 &&
                    groupWallets.map((group, i) =>
                        <Collapse in={groupOpen} timeout="auto" unmountOnExit key={`collapse${i}`}>
                            <List>
                                <ListItem button onClick={() => this.redirect(`/groups/${group.id}`)}>
                                    <ListItemIcon>
                                        <GroupWork style={{ color: "#f39c12" }} />
                                    </ListItemIcon>
                                    <ListItemText primary={group.name} />
                                    <span style={{ color: group.money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(group.money).toFixed(2))}</span>
                                </ListItem>
                            </List>
                        </Collapse>
                    )
                }
                <Collapse in={groupOpen} timeout="auto" unmountOnExit>
                    <List><ListItem button onClick={() => this.setDialog(true, "group")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.create_group" })} /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={() => this.redirect(routes.HISTORY)}><ListItemIcon><History style={{ color: "#d35400" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.history" })} /></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.ACCOUNT)}><ListItemIcon><Settings style={{ color: "#7f8c8d" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.account" })} /></ListItem></List>

                {/* Language Option */}
                <List><ListItem button onClick={(e) => this.toggleOption(e, "language")}><ListItemIcon><Language style={{ color: "#9b59b6" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.language" })} />{languageOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                <Collapse in={languageOpen} timeout="auto" unmountOnExit>
                    {/* English */}
                    <List>
                        <ListItem button onClick={() => this.props.setLanguage("en", EN)}>
                            <ListItemIcon>
                                {language === "en"
                                    ? <RadioButtonChecked style={{ color: "#9b59b6" }} />
                                    : <RadioButtonUnchecked style={{ color: "#9b59b6" }} />
                                }
                            </ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "languages.en" })} />
                        </ListItem>
                    </List>

                    {/* Chinese (Traditional) */}
                    <List>
                        <ListItem button onClick={() => this.props.setLanguage("zh-TW", ZH_TW)}>
                            <ListItemIcon>
                                {language === "zh-TW"
                                    ? <RadioButtonChecked style={{ color: "#9b59b6" }} />
                                    : <RadioButtonUnchecked style={{ color: "#9b59b6" }} />
                                }
                            </ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "languages.zh" })} />
                        </ListItem>
                    </List>
                </Collapse>

                <List><ListItem button onClick={this.signOut}><ListItemIcon><Exit style={{ color: "#2c3e50" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.sign_out" })} /></ListItem></List>
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer className={classes.drawer} open={open} onClose={() => this.toggleDrawer(false)}>
                            <div
                                tabIndex={0}
                                role="button"
                                onKeyDown={() => this.toggleDrawer(false)}
                            >
                                {sideList}
                            </div>
                        </Drawer>

                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <span style={{ cursor: "pointer", color: "#3fb5a3" }} onClick={() => this.props.history.push(routes.HOME)}>
                                <FormattedMessage id="wallet_savior" />
                            </span>
                        </Typography>
                    </Toolbar>
                </AppBar>

                {
                    dialog &&
                    <Create open={dialog} handleClose={this.setDialog} toggleDrawer={this.toggleDrawer} option={option} />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    language: state.languageState.language
})

const mapDispatchToProps = (dispatch) => ({
    setLanguage: (language, messages) => dispatch({ type: actions.SET_LANGUAGE, language, messages })
})

export default compose(
    injectIntl,
    withRouter,
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
)(NavigationAuth);