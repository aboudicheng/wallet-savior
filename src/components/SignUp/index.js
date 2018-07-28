import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import {
  Link,
  withRouter,
} from "react-router-dom";
import { SignInLink } from "../SignIn";
import { auth, db } from "../../firebase";
import firebase from "firebase/app"
import { signMethodHandler } from "../../helpers";
import * as actions from "../../constants/action_types";
import * as routes from "../../constants/routes";

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
  },
  facebook: {
    margin: theme.spacing.unit,
    backgroundColor: "#3C66C4"
  }
});

class SignUpForm extends Component {
  componentDidUpdate() {
    //if the user is already logged in, prevent logging in again
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
          initialize: this.props.initializeSignup,
          setError: this.props.setSignupError
        })
      )
      .catch((error) => {
        this.props.setSignupError(error);
      })
  }

  signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.doSignInWithPopup(provider)
      .then((res) =>
        signMethodHandler({
          res,
          history: this.props.history,
          initialize: this.props.initializeSignup,
          setError: this.props.setSignupError
        })
      )
      .catch((error) => {
        this.props.setSignupError(error);
      })
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.props.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email)
          .then(() => {
            this.props.initializeSignup();
            history.push(routes.HOME);
          })
          .catch((error) => {
            this.props.setSignupError(error);
          });

      })
      .catch((error) => {
        this.props.setSignupError(error);
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.props.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      username === "" ||
      email === "";

    const { classes } = this.props;

    return (
      <div>
        <h1>SignUp</h1>
        <form onSubmit={this.onSubmit} className={classes.container}>
          <TextField
            id="username"
            label="Username"
            className={classes.textField}
            value={username}
            onChange={(event) => this.props.setSignupUsername(event.target.value)}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email Address"
            className={classes.textField}
            value={email}
            onChange={(event) => this.props.setSignupEmail(event.target.value)}
            margin="normal"
          />
          <TextField
            id="passwordone"
            label="Password"
            type="password"
            className={classes.textField}
            value={passwordOne}
            onChange={(event) => this.props.setSignupPasswordOne(event.target.value)}
            margin="normal"
          />
          <TextField
            id="passwordtwo"
            label="Confirm Password"
            type="password"
            className={classes.textField}
            value={passwordTwo}
            onChange={(event) => this.props.setSignupPasswordTwo(event.target.value)}
            margin="normal"
          />

          <div style={{ margin: "0 auto", width: "100%" }}>
            <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Sign Up</Button>
          </div>

          <FacebookLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithFacebook} />

          <GoogleLoginButton style={{ fontSize: 17, width: "100%" }} align="center" onClick={this.signInWithGoogle} />

          {error && <p style={{ color: "#d32f2f" }}>{error.message}</p>}

        </form>
        <SignInLink />
      </div>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don"t have an account?
    {" "}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>;

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  state: state.signupState
})

const mapDispatchToProps = (dispatch) => ({
  initializeSignup: () => dispatch({ type: actions.INITIALIZE_SIGNUP }),
  setSignupError: (error) => dispatch({ type: actions.SET_SIGNUP_ERROR, error }),
  setSignupUsername: (username) => dispatch({ type: actions.SET_SIGNUP_USERNAME, username }),
  setSignupEmail: (email) => dispatch({ type: actions.SET_SIGNUP_EMAIL, email }),
  setSignupPasswordOne: (passwordOne) => dispatch({ type: actions.SET_SIGNUP_PASSWORD1, passwordOne }),
  setSignupPasswordTwo: (passwordTwo) => dispatch({ type: actions.SET_SIGNUP_PASSWORD2, passwordTwo })
})

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(SignUpForm);

export {
  SignUpLink,
};