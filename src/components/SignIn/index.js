import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { withRouter, Link } from 'react-router-dom';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
    flexWrap: 'wrap',
    width: 300,
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

const SignInPage = (props) =>
  <div>
    <h1>Login</h1>
    <SignInForm history={props.history} classes={props.classes} />
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

    this.state = { ...INITIAL_STATE };
  }

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

export default withRouter(withStyles(styles)(SignInPage));

export {
  SignInForm,
  SignInLink
};
