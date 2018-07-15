import React from 'react'
import { withRouter } from 'react-router'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import * as routes from '../../constants/routes';

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
        width: 'auto',
    },
};

class NavigationNonAuth extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
        }
    }

    toggleDrawer = (open) => () => {
        this.setState({ open });
    };

    redirect = (route) => {
        this.props.history.push(route)
    }

    render() {
        const { classes } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={() => this.redirect(routes.LOGIN)}><ListItemText>Login</ListItemText></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.SIGN_UP)}><ListItemText>Sign Up</ListItemText></ListItem></List>
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
                            Wallet $avior
      </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(NavigationNonAuth));