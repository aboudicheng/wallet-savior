import React, { Component } from 'react';

class NewWallet extends Component {
    render() {
        console.log(this.props)
        const { name } = this.props.match.params
        return (
            <div>
                <h1>{name}</h1>
            </div>
        )
    }
}

export default NewWallet;