import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { SignInLink } from '../SignIn'
import { auth, db } from '../../firebase';
import * as routes from '../../constants/routes';

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
});

const SignUpPage = (props) =>
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={props.history} classes={props.classes} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(updateByPropertyName('error', error));
          });

      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
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
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    const { classes } = this.props

    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
        <TextField
          id="username"
          label="Username"
          className={classes.textField}
          value={username}
          onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
          margin="normal"
        />
        <TextField
          id="email"
          label="Email Address"
          className={classes.textField}
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          margin="normal"
        />
        <TextField
          id="passwordone"
          label="Password"
          type="password"
          className={classes.textField}
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          margin="normal"
        />
        <TextField
          id="passwordtwo"
          label="Confirm Password"
          type="password"
          className={classes.textField}
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          margin="normal"
        />

        <div style={{ margin: '0 auto', width: '100%' }}>
          <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Sign Up</Button>
        </div>

        {error && <p style={{ color: "#d32f2f" }}>{error.message}</p>}

        <SignInLink />
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(withStyles(styles)(SignUpPage));

export {
  SignUpForm,
  SignUpLink,
};