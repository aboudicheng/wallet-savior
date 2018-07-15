import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose'
import { auth } from '../../firebase';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
};

const Navigation = (props) =>
  <div>
    {props.authUser
      ? <NavigationAuth classes={props.classes} />
      : <NavigationNonAuth classes={props.classes} />
    }
  </div>


const NavigationAuth = ({ classes }) =>
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Title
        </Typography>
        <Button color="inherit"><Link to={routes.HOME}>Home</Link></Button>
        <Button color="inherit"><Link to={routes.ACCOUNT}>Account</Link></Button>
        <Button color="inherit" onClick={auth.doSignOut}><Link to={routes.ACCOUNT}>Sign Out</Link></Button>
      </Toolbar>
    </AppBar>
  </div>

const NavigationNonAuth = ({ classes }) =>
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Wallet $avior
      </Typography>
        <Button color="inherit"><Link to={routes.SIGN_IN}>Sign In</Link></Button>
      </Toolbar>
    </AppBar>
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(Navigation);
