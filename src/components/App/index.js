import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import Group from '../Group'
import History from '../History'
import NotFound from '../NotFound'
import withAuthentication from '../Session/withAuthentication';
import * as routes from '../../constants/routes';

import './index.css';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  },
});

const App = (props) =>
  <Router basename={process.env.PUBLIC_URL}>
    <div className="app">
      <Navigation />

      <div className="container">
        <Paper className={props.classes.root} elevation={5}>
          <Switch>
            <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
            <Route exact path={routes.LOGIN} component={() => <SignInPage />} />
            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
            <Route exact path={routes.HOME} component={() => <HomePage />} />
            <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
            <Route exact path={routes.GROUP} component={() => <Group />} />
            <Route exact path={routes.HISTORY} component={() => <History />} />
            <Route component={NotFound} />
          </Switch>
        </Paper>
      </div>

    </div>
  </Router>

export default withAuthentication(withStyles(styles)(App));