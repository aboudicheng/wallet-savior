import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import DeleteAccount from './deleteAccount'
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';

const AccountPage = ({ authUser }) =>
  <div>
    <h1>Account: {authUser.email}</h1>
    <h2>Change Password</h2>
    <PasswordChangeForm />
    <hr />
    <h2>Delete Account</h2>
    <DeleteAccount />
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps),
)(AccountPage);