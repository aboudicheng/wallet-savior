import React from 'react';
import { connect } from 'react-redux';

import NavigationAuth from './auth'
import NavigationNonAuth from './nonauth'

const Navigation = ({ authUser }) =>
  <div>
    {authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
