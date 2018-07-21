import React, { Component } from 'react';

class GroupWallet extends Component {
    render() {
        const { name } = this.props.match.params
        return (
            <div>
                <h1>{name}</h1>
            </div>
        )
    }
}

export default GroupWallet