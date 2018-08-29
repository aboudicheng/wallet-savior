import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import formatNumber from "format-number";
import { FormattedMessage, injectIntl } from "react-intl";

//TODO: add remove button for records that belong to the current user

const styles = (theme) => ({
    root: {
        width: "100%",
    },
    deleteButton: {
        margin: theme.spacing.unit,
        right: "1.8rem",
        bottom: "1.8rem",
        position: "fixed",
    },
    typography: {
        width: "100%",
        fontSize: "1.2rem"
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 2,
        display: "inline-flex",
        flexFlow: "column wrap",
    }
});

const groupRef = firebase.database().ref("groups");

class GroupHistory extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            history: [],
        };
    }

    componentDidMount() {
        //iterate through every single history record of the corresponding group
        groupRef.child(`${this.props.id}/history`).on('child_added', (snapshot) => {
            //find the username in order to push it into the record instead of id
            firebase.database().ref(`users/${snapshot.val().user}`).once('value', (snap) => {
                const record = snapshot.val();
                record.user = snap.val().username;

                this.setState((prevState) => ({
                    history: [...prevState.history, record],
                    isLoading: false,
                }));
            })
        })

        //if this group does not have any record, set isLoading to false
        groupRef.child(this.props.id).once("value", (snapshot) => {
            if (!snapshot.val().history) {
                this.setState({ isLoading: false });
            }
        });
    }

    componentDidUpdate(props) {
        //if user switches between two groups then initialize the history
        if (props.id !== this.props.id) {

            //iterate through every single history record of the corresponding group
            groupRef.child(`${this.props.id}/history`).on('child_added', (snapshot) => {
                
                //find the username in order to push it into the record instead of id
                firebase.database().ref(`users/${snapshot.val().user}`).once('value', (snap) => {
                    const record = snapshot.val();
                    record.user = snap.val().username;

                    this.setState((prevState) => ({
                        history: [...prevState.history, record],
                        isLoading: false,
                    }));
                })
            })

            //if this group does not have any record, set isLoading to false
            groupRef.child(this.props.id).once("value", (snapshot) => {
                if (!snapshot.val().history) {
                    this.setState({ isLoading: false, history: [] });
                }
            });
        }
    }

    render() {
        const { history, isLoading } = this.state;
        const { classes, intl } = this.props;

        const fieldStyle = {
            fontWeight: "bold"
        };

        if (isLoading)
            return <CircularProgress className={classes.progress} size={50} />;

        return (
            <div>
                <h1><FormattedMessage id="group.history" /></h1>
                {history.length === 0
                    ? <p><FormattedMessage id="group.no_records" /></p>
                    : <div>
                        {history.slice().reverse().map((record, i) => {
                            return (
                                <Paper className={classes.paper} elevation={5} key={i}>
                                    <h3>
                                        {`${record.date.day} ${record.date.month} ${record.date.year} ${record.date.hour}:${record.date.min}`}
                                    </h3>
                                    <div>
                                        <span style={fieldStyle}><FormattedMessage id="group.user" />: </span>{record.user}
                                    </div>
                                    <div>
                                        <span style={fieldStyle}><FormattedMessage id="group.type" />: </span>{record.type}
                                    </div>
                                    <div>
                                        <span style={fieldStyle}><FormattedMessage id="group.amount" />: </span>{formatNumber({ prefix: "$" })(record.amount)}
                                    </div>
                                </Paper>
                            );
                        })
                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    state: state.historyState
});

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
    injectIntl
)(GroupHistory);