import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router'
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
import Money from '@material-ui/icons/MonetizationOn'
import { withStyles } from '@material-ui/core/styles';
import * as routes from '../../constants/routes';
import * as firebase from 'firebase'
import Create from './create'

const styles = theme => ({
    root: {
        flexGrow: 1,
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
        }
    }

    componentDidMount() {
        firebase.database().ref(`users/${this.props.authUser.uid}`).on('value', snapshot => {
            this.setState({ mainWallet: snapshot.val().wallets[0].name })
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
        this.setState({ open: false })
        this.redirect(routes.LOGIN)
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
        const { open, walletOpen, groupOpen, dialog, option } = this.state

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={e => this.toggleOption(e, "wallet")}><ListItemIcon><Home /></ListItemIcon><ListItemText primary="Personal" />{walletOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                <Collapse in={walletOpen} timeout="auto" unmountOnExit>
                    <List><ListItem button onClick={() => this.redirect(routes.HOME)}><ListItemIcon><Money /></ListItemIcon><ListItemText primary={this.state.mainWallet} /></ListItem></List>
                </Collapse>
                <Collapse in={walletOpen} timeout="auto" unmountOnExit>
                    <List><ListItem button onClick={() => this.setDialog(true, "wallet")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary="Add Wallet" /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={e => this.toggleOption(e, "group")}><ListItemIcon><Group /></ListItemIcon><ListItemText primary="Group" />{groupOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                <Collapse in={groupOpen} timeout="auto" unmountOnExit>
                    <List><ListItem button onClick={() => this.setDialog(true, "group")}><ListItemIcon><AddCircle /></ListItemIcon><ListItemText primary="Create Group" /></ListItem></List>
                </Collapse>

                <List><ListItem button onClick={() => this.redirect(routes.HISTORY)}><ListItemIcon><History /></ListItemIcon><ListItemText primary="History" /></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.ACCOUNT)}><ListItemIcon><Settings /></ListItemIcon><ListItemText primary="Account" /></ListItem></List>
                <List><ListItem button onClick={this.signOut}><ListItemIcon><Exit /></ListItemIcon><ListItemText primary="Sign Out" /></ListItem></List>
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer open={open} onClose={() => this.toggleDrawer(false)}>
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