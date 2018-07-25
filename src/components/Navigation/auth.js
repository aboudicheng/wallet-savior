import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router'
import formatNumber from 'format-number';
import { auth } from '../../firebase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Home from '@material-ui/icons/Home'
import Settings from '@material-ui/icons/Settings'
import Group from '@material-ui/icons/Group'
import Exit from '@material-ui/icons/ExitToApp'
import AddCircle from '@material-ui/icons/AddCircleOutline'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import History from '@material-ui/icons/History'
import GroupWork from '@material-ui/icons/GroupWork'
import Money from '@material-ui/icons/MonetizationOn'
import { withStyles } from '@material-ui/core/styles';
import * as routes from '../../constants/routes';
import * as firebase from 'firebase/app'
import Create from './create'

const styles = theme => ({
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
        width: 'auto',
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
})

class NavigationAuth extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            walletOpen: false,
            groupOpen: false,
            mainWallet: "",
            dialog: false,
            option: "",
            wallets: [],
            groupWallets: [],
        }
    }

    componentDidMount() {
        firebase.database().ref(`users/${this.props.authUser.uid}`).on('value', snapshot => {
            const { groups, wallets } = snapshot.val()
            let groupWallets = []

            for (let key in groups) {
                firebase.database().ref(`groups/`).once('value', s => {
                    console.log("update")
                    groupWallets.push(s.val()[groups[key].id])
                })
            }

            const newWallets = _.values(wallets)

            this.setState({
                wallets: newWallets,
                groupWallets,
            })
        })
    }

    toggleDrawer = (open) => {
        this.setState({ open });
    };

    toggleOption = (e, option) => {
        if (option === "wallet") {
            this.setState(state => ({ walletOpen: !state.walletOpen }));
        }
        else {
            this.setState(state => ({ groupOpen: !state.groupOpen }));
        }
    };

    redirect = (route) => {
        this.setState({ open: false })
        this.props.history.push(route)
    }

    signOut = () => {
        auth.doSignOut();
    }

    setDialog = (open, option) => {
        if (!open) {
            this.setState({ dialog: open, option: "" })
        }
        else {
            this.setState({ dialog: open, option })
        }
    }

    render() {
        const { classes } = this.props;
        const { open, walletOpen, groupOpen, dialog, option, wallets, groupWallets } = this.state

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={e => this.toggleOption(e, "wallet")}><ListItemIcon><Home style={{ color: "#2ecc71" }} /></ListItemIcon><ListItemText primary="Personal" />{walletOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
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
                    <List><ListItem button onClick={() => this.setDialog(true, "wallet")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary="Add Wallet" /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={e => this.toggleOption(e, "group")}><ListItemIcon><Group style={{ color: "#2980b9" }} /></ListItemIcon><ListItemText primary="Group" />{groupOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
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
                    <List><ListItem button onClick={() => this.setDialog(true, "group")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary="Create Group" /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={() => this.redirect(routes.HISTORY)}><ListItemIcon><History style={{ color: "#d35400" }} /></ListItemIcon><ListItemText primary="History" /></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.ACCOUNT)}><ListItemIcon><Settings style={{ color: "#7f8c8d" }} /></ListItemIcon><ListItemText primary="Account" /></ListItem></List>
                <List><ListItem button onClick={this.signOut}><ListItemIcon><Exit style={{ color: "#2c3e50" }} /></ListItemIcon><ListItemText primary="Sign Out" /></ListItem></List>
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
                                Wallet $avior
                            </span>
                        </Typography>
                    </Toolbar>
                </AppBar>

                {
                    dialog &&
                    <Create open={dialog} handleClose={this.setDialog} toggleDrawer={this.toggleDrawer} option={option} />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    withRouter,
    withStyles(styles),
    connect(mapStateToProps)
)(NavigationAuth);