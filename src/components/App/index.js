import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { compose } from "recompose";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Navigation from "../Navigation";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import History from "../History";
import NewWallet from "../NewWallet";
import GroupWallet from "../GroupWallet";
import NotFound from "../NotFound";
import withAuthentication from "../Session/withAuthentication";
import * as routes from "../../constants/routes";
import "./index.css";

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  },
});

class App extends Component {

  //label the user's status as online if logged in
  componentDidUpdate() {
    if (firebase.auth().currentUser) {
      const connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", () => {
        const presenceRef = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/connected`)
        presenceRef.onDisconnect().remove()
        presenceRef.set(true)
      });
    }
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="app">
          <Navigation />

          <div className="container">
            <Paper className={this.props.classes.root} elevation={5}>
              <Switch>
                <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
                <Route exact path={routes.LOGIN} component={() => <SignInPage />} />
                <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
                <Route exact path={routes.HOME} component={() => <HomePage />} />
                <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
                <Route exact path={routes.NEW_WALLET} component={(props) => <NewWallet {...props} />} />
                <Route exact path={routes.GROUP_WALLET} component={(props) => <GroupWallet {...props} />} />
                <Route exact path={routes.HISTORY} component={() => <History />} />
                <Route component={NotFound} />
              </Switch>
            </Paper>
          </div>

        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
})

export default compose(
  withAuthentication,
  withStyles(styles),
  connect(mapStateToProps),
)(App);