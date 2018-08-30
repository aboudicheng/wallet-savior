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
import * as routes from "../../constants/routes";
import firebase from "firebase/app";
import { signMethodHandler } from "../../helpers";
import * as loginActions from "../../actions/loginActions";
import { injectIntl, FormattedMessage } from 'react-intl';

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

    const { classes, intl } = this.props;

    return (
      <div>
        <h1><FormattedMessage id="sign_in.login" /></h1>
        <form onSubmit={this.onSubmit} className={classes.container}>
          <TextField
            id="email"
            label={intl.formatMessage({ id: "sign_in.email_address" })}
            className={classes.textField}
            value={email}
            onChange={(event) => this.props.setLoginEmail(event.target.value)}
            margin="normal"
          />
          <TextField
            id="password"
            label={intl.formatMessage({ id: "sign_in.password", defaultMessage: "Password" })}
            type="password"
            className={classes.textField}
            value={password}
            onChange={(event) => this.props.setLoginPassword(event.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            disabled={isInvalid}
            type="submit"
            className={classes.button}
          >
            <FormattedMessage id="sign_in.login" defaultMessage="Login" />
          </Button>

          <FacebookLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithFacebook}>
            <FormattedMessage id="sign_in.login_with_facebook" />
          </FacebookLoginButton>

          <GoogleLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithGoogle}>
            <FormattedMessage id="sign_in.login_with_facebook" />
          </GoogleLoginButton>

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
    <span>
      <FormattedMessage id="sign_in.already_have_an_account" />
      <br />
      <FormattedMessage id="sign_in.click" /> <Link to={routes.LOGIN}>
      <FormattedMessage id="sign_in.here" />
      </Link> <FormattedMessage id="sign_in.login" />
    </span>
  </p>;

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  state: state.loginState
});

const mapDispatchToProps = (dispatch) => ({
  initializeLogin: dispatch(loginActions.initializeLogin()),
  setLoginError: (error) => dispatch(loginActions.setLoginError(error)),
  setLoginEmail: (email) => dispatch(loginActions.setLoginEmail(email)),
  setLoginPassword: (password) => dispatch(loginActions.setLoginPassword(password))
})

export default compose(
  injectIntl,
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SignInForm);

export {
  SignInLink
};
