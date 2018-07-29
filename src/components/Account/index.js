import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
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
          <Tooltip TransitionComponent={Zoom} title={authUser.displayName}>
            <img src={authUser.providerData[0].photoURL} alt={authUser.displayName} style={style} />
          </Tooltip>
          
        }
        <h3>{authUser.displayName ? authUser.displayName : authUser.email}</h3>

        <span style={{ fontWeight: "bold" }}>Email: </span><p>{authUser.email}</p>
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