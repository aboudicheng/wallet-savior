import React, { Component } from "react";
import firebase from "firebase/app";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "recompose";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import blue from "@material-ui/core/colors/blue";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import DeleteAccount from "./deleteAccount";
import PasswordChangeForm from "../PasswordChange";
import withAuthorization from "../Session/withAuthorization";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
    width: 50,
    height: 50,
    margin: "0 auto"
  },
})

class AccountPage extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      isLoading: true,
      snackbarOpen: false,
    }
  }
  componentDidMount() {
    firebase.database().ref(`users/${this.props.authUser.uid}/username`).once("value", snapshot => {
      this.setState({ username: snapshot.val(), isLoading: false });
    })
  }

  handleChange = (e) => {
    this.setState({ username: e.target.value });
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  onSubmit = (e) => {
    const { username } = this.state;
    if (username !== "") {
      firebase.database().ref(`users/${this.props.authUser.uid}`).update({ username: username });
      this.setState({ snackbarOpen: true });
    }

    e.preventDefault();
  }

  render() {
    const { username, isLoading, snackbarOpen } = this.state;
    const { authUser, classes } = this.props;
    return (
      <div>
        {isLoading
          ? <CircularProgress size={50} />
          :
          <div>
            <div style={{ marginBottom: "1rem" }}>
              {authUser.providerData[0].providerId !== "password"
                ? <img
                  src={authUser.providerData[0].photoURL}
                  alt={username}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                  }}
                />
                : <Avatar className={classes.avatar}>
                  <PersonIcon style={{ width: "100%", height: "80%" }} />
                </Avatar>
              }

              <div style={{ margin: "1rem auto" }}><span style={{ fontWeight: "bold" }}>Email: </span><span>{authUser.email}</span></div>

              <form style={{ width: "100%" }} onSubmit={this.onSubmit}>
                <TextField
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  className={classes.textField}
                  //style={{ margin: "1.5rem" }}
                  value={username}
                  onChange={this.handleChange}
                />

                <Button variant="contained" color="primary" type="submit" className={classes.button}>Reset</Button>
              </form>

            </div>

            <Divider />

            {authUser.providerData[0].providerId === "password" &&
              <div>
                <h2>Change Password</h2>
                <PasswordChangeForm />
                <Divider />
              </div>
            }

            <div style={{
              top: "0.8rem",
              right: "0.5rem",
              position: "absolute",
            }}><DeleteAccount /></div>

            {/*Snackbar poppup*/}
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={this.handleSnackbarClose}
            >
              <MySnackbarContentWrapper
                onClose={this.handleSnackbarClose}
                variant="success"
                message="Operation successful!"
              />
            </Snackbar>

          </div>
        }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps),
  withStyles(styles),
)(AccountPage);