import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Account from "@material-ui/icons/AccountCircle";
import Person from "@material-ui/icons/PersonAdd";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import { FormattedMessage, injectIntl } from "react-intl";
import * as routes from "../../constants/routes";

const styles = {
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
        width: "auto",
    },
};

class NavigationNonAuth extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    toggleDrawer = (open) => () => {
        this.setState({ open });
    };

    redirect = (route) => {
        this.props.history.push(route);
    }

    render() {
        const { classes, intl } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={() => this.redirect(routes.LOGIN)}><ListItemIcon><Account /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "sign_in.login" })} /></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.SIGN_UP)}><ListItemIcon><Person /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "sign_up.sign_up" })} /></ListItem></List>
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer open={this.state.open} onClose={this.toggleDrawer(false)}>
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={this.toggleDrawer(false)}
                                onKeyDown={this.toggleDrawer(false)}
                            >
                                {sideList}
                            </div>
                        </Drawer>

                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <span style={{ color: "#3fb5a3" }}>
                                <FormattedMessage id="wallet_savior" />
                            </span>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default compose(
    withRouter,
    withStyles(styles),
    injectIntl
)(NavigationNonAuth);