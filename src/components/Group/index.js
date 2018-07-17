import React, { Component } from 'react';
import withAuthorization from '../Session/withAuthorization';

class Group extends Component {
    render() {
        return (
            <h1>Group Accounts</h1>
        )
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Group);