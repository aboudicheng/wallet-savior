import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { auth } from "../../firebase";

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

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "";

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
        <TextField
          id="passwordOne"
          label="New Password"
          className={classes.textField}
          value={passwordOne}
          onChange={(event) => this.setState(updateByPropertyName("passwordOne", event.target.value))}
          margin="normal"
        />
        <TextField
          id="passwordTwo"
          label="Confirm New Password"
          className={classes.textField}
          value={passwordTwo}
          onChange={(event) => this.setState(updateByPropertyName("passwordTwo", event.target.value))}
          margin="normal"
        />
        
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className={classes.button}>Reset password</Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withStyles(styles)(PasswordChangeForm);