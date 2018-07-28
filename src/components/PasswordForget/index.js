import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
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
});

const PasswordForgetPage = ({ classes }) =>
  <div>
    <h1>Password Forget</h1>
    <PasswordForgetForm classes={classes}/>
  </div>;

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: "",
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch((error) => {
        this.setState(updateByPropertyName("error", error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === "";

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
      <TextField
          id="email"
          label="Email Address"
          className={classes.textField}
          value={email}
          onChange={(event) => this.setState(updateByPropertyName("email", event.target.value))}
          margin="normal"
        />

        <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Reset password</Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>;

export default withStyles(styles)(PasswordForgetPage);

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
