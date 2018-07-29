import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Divider from "@material-ui/core/Divider";
import DeleteAccount from "./deleteAccount";
import PasswordChangeForm from "../PasswordChange";
import withAuthorization from "../Session/withAuthorization";

const style = {
  width: 50,
  height: 50,
  borderRadius: "50%",
};

class AccountPage extends Component {
  render() {
    const { authUser } = this.props;
    console.log(authUser)
    return (
      <div>
        {authUser.providerData[0].providerId !== "password" &&
          <img src={authUser.providerData[0].photoURL} alt={authUser.displayName} style={style} />
        }
        <p>{authUser.displayName ? authUser.displayName : authUser.email}</p>
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
)(AccountPage);