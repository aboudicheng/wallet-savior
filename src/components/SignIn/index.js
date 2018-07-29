import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { withRouter, Link } from "react-router-dom";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { auth } from "../../firebase";
import * as actions from "../../constants/action_types";
import * as routes from "../../constants/routes";
import firebase from "firebase/app";
import { signMethodHandler } from "../../helpers";

// function isRunningStandalone() {
//   return (window.matchMedia("(display-mode: standalone)").matches);
// }

const styles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    flexWrap: "wrap",
    width: "14rem",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  button: {
    margin: theme.spacing.unit,
  },
  google: {
    margin: theme.spacing.unit,
    backgroundColor: "#CF4332"
  }
});

class SignInForm extends Component {
  componentDidUpdate() {
    if (this.props.authUser) {
      this.props.history.push(routes.HOME);
    }
  }

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.doSignInWithPopup(provider)
      .then((res) =>
        signMethodHandler({
          res,
          history: this.props.history,
          initialize: this.props.initializeLogin,
          setError: this.props.setLoginError
        })
      )
      .catch((error) => {
        this.props.setLoginError(error);
      });
  }

  signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.doSignInWithPopup(provider)
      .then((res) =>
        signMethodHandler({
          res,
          history: this.props.history,
          initialize: this.props.initializeLogin,
          setError: this.props.setLoginError
        })
      )
      .catch((error) => {
        this.props.setLoginError(error);
      });
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.props.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.initializeLogin();
        history.push(routes.HOME);
      })
      .catch((error) => {
        this.props.setLoginError(error);
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.props.state;

    const isInvalid =
      password === "" ||
      email === "";

    const { classes } = this.props;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit} className={classes.container}>
          <TextField
            id="email"
            label="Email Address"
            className={classes.textField}
            value={email}
            onChange={(event) => this.props.setLoginEmail(event.target.value)}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            className={classes.textField}
            value={password}
            onChange={(event) => this.props.setLoginPassword(event.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Login</Button>

          <FacebookLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithFacebook} />

          <GoogleLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithGoogle} />

          {error && <p style={{ color: "#d32f2f" }}>{error.message}</p>}
        </form>

        <PasswordForgetLink />
        <SignUpLink />
      </div>
    );
  }
}

const SignInLink = () =>
  <p>
    Already have an account?
    <br />
    Click <Link to={routes.LOGIN}>here</Link> to login
  </p>;

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  state: state.loginState
});

const mapDispatchToProps = (dispatch) => ({
  initializeLogin: () => dispatch({ type: actions.INITIALIZE_LOGIN }),
  setLoginError: (error) => dispatch({ type: actions.SET_LOGIN_ERROR, error }),
  setLoginEmail: (email) => dispatch({ type: actions.SET_LOGIN_EMAIL, email }),
  setLoginPassword: (password) => dispatch({ type: actions.SET_LOGIN_PASSWORD, password })
})

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SignInForm);

export {
  SignInLink
};
