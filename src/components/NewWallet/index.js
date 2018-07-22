import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import firebase from 'firebase/app'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import formatNumber from "format-number";

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
})

class NewWallet extends Component {
    constructor() {
        super();

        this.state = {
            wallet: null,
            isLoading: true,
        }

    }

    componentDidMount() {
        //if user access via history.push
        if (this.props.history.action === "PUSH" || this.props.authUser) {
            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.match.params.id}`).once('value', snapshot => {
                this.setState({ wallet: snapshot.val(), isLoading: false })
            })
        }
    }

    componentDidUpdate() {
        //Wait until it gets authUser info
        if (this.props.authUser && this.state.isLoading) {
            firebase.database().ref(`users/${this.props.authUser.uid}/wallets/${this.props.match.params.id}`).once('value', snapshot => {
                this.setState({ wallet: snapshot.val(), isLoading: false })
            })
        }
    }

    render() {
        const { wallet, isLoading } = this.state
        const { classes } = this.props
        return (
            <div>
                {
                    isLoading
                        ? <CircularProgress className={classes.progress} size={50} />
                        :
                        <div>
                            <h1>{wallet.name}</h1>
                            <span style={{ fontSize: "170%", color: wallet.money >= 0 ? "#3fb5a3" : "#ff0000" }}>{formatNumber({ prefix: "$" })(parseFloat(wallet.money).toFixed(2))}</span>
                        </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    withStyles(styles),
    connect(mapStateToProps)
)(NewWallet);