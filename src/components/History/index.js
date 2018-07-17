import React, { Component } from 'react';
import withAuthorization from '../Session/withAuthorization';

class History extends Component {
    render() {
        return (
            <h1>History</h1>
        )
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(History);