import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import FirstUse from './firstUseDialog'
import withAuthorization from '../Session/withAuthorization';
import firebase from 'firebase';

const usersRef = firebase.database().ref('users/')

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      firstUse: false,
      open: true,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  setFirstUse = () => {
    usersRef.child(this.props.authUser.uid).update({ firstUse: false })
    this.setState({ firstUse: false })
  }

  componentDidMount() {
    usersRef.on('child_added', snapshot => {
      if (snapshot.val().firstUse) {
        this.setState({ firstUse: true })
      }
    })
  }

  render() {

    return (
      <div>
        <h1>My Wallet</h1>

        {this.state.firstUse &&
          <FirstUse open={this.state.open} handleClose={this.handleClose} setFirstUse={this.setFirstUse} />
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps)
)(HomePage);
