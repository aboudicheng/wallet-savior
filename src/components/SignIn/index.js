import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { withRouter, Link } from 'react-router-dom';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import firebase from 'firebase/app';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
    flexWrap: 'wrap',
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

const SignInPage = (props) =>
  <div>
    <h1>Login</h1>
    <SignInForm history={props.history} classes={props.classes} authUser={props.authUser} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE, users: [] };
  }

  componentDidMount() {
    firebase.database().ref('users').on('child_added', snapshot =>
      this.setState(prevState => ({
        users: [...prevState.users, snapshot.val()]
      }))
    );
  }

  // signInWithGoogle = () => {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   auth.doSignInWithPopup(provider)
  //     .then(res => {
  //       const user = res.user

  //       const result = this.state.users.find(u => user.email === u.email)

  //       if (!result) {
  //         db.doCreateUser(user.uid, user.displayName, user.email)
  //           .then(() => {
  //             this.setState(() => ({ ...INITIAL_STATE }));
  //             this.props.history.push(routes.HOME);
  //           })
  //           .catch(error => {
  //             this.setState(updateByPropertyName('error', error));
  //           });
  //       }
  //       else {
  //         firebase.auth().signInWithEmailLink(user.email)
  //           .then(() => {
  //             this.setState(() => ({ ...INITIAL_STATE }));
  //           })
  //           .catch(error => console.log(error))
  //       }
  //     })
  // }

  // signInWithFacebook = () => {
  //   const provider = new firebase.auth.FacebookAuthProvider()
  //   firebase.auth().signInWithRedirect(provider)
  //     .then(res => {
  //       const user = res.user

  //       firebase.auth().signInWithEmailLink(user.email)
  //         .then(() => {
  //           this.setState(() => ({ ...INITIAL_STATE }));
  //         })

  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  componentDidUpdate() {
    if (this.props.authUser) {
      this.props.history.push(routes.HOME);
    }
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    const { classes } = this.props

    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
        <TextField
          id="email"
          label="Email Address"
          className={classes.textField}
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          margin="normal"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.textField}
          value={password}
          onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
          margin="normal"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Login</Button>

        {/* <div style={{ margin: '0 auto', width: '100%' }}>
          <Button variant="contained" color="primary" className={classes.facebook} onClick={this.signInWithFacebook}>Sign in with Facebook</Button>
        </div> */}

        {/* <div style={{ margin: '0 auto', width: '100%' }}>
          <Button variant="contained" color="secondary" className={classes.google} onClick={this.signInWithGoogle}>Sign in with Google</Button>
        </div> */}

        {error && <p style={{ color: "#d32f2f" }}>{error.message}</p>}
      </form>
    );
  }
}

const SignInLink = () =>
  <p>
    Already have an account?
    <br />
    Click <Link to={routes.LOGIN}>here</Link> to login
  </p>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser
})

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps)
)(SignInPage);

export {
  SignInForm,
  SignInLink
};
