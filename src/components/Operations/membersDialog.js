import React from "react";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import blue from "@material-ui/core/colors/blue";
import * as firebase from "firebase/app";
import { FormattedMessage, injectIntl } from "react-intl";
import "./index.css";

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class MembersDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            members: [],
        };
    }

    componentDidMount() {
        firebase.database().ref(`groups/${this.props.groupId}/member`).once("value", (snapshot) => {
            for (let key in snapshot.val()) {
                firebase.database().ref(`users/${key}`).once("value", (s) => {
                    //let the current user get shown at the top of the list
                    if (s.val().username.uid === this.props.authUser.uid) {
                        this.setState((prevState) => ({
                            members: [s.val(), ...prevState.members]
                        }));
                    }
                    else {
                        this.setState((prevState) => ({
                            members: [...prevState.members, s.val()]
                        }));
                    }
                });
            }
        });
    }

    render() {
        const { members } = this.state;
        const { classes, intl } = this.props;

        //TODO: onClick range
        return (
            <Dialog
                open={this.props.open}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null); }}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title"><FormattedMessage id="dialogs.members.title" /></DialogTitle>
                <div>
                    <List>
                        {members.length > 0 &&
                            members.map((member, i) => (
                                <ListItem key={i}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    {<span className={member.connected ? "online" : "offline"}></span>}
                                    <ListItemText primary={i === 0 ? intl.formatMessage({ id: "dialogs.members.you" }) : member.username} />
                                </ListItem>
                            ))}
                        <ListItem button data-option="invite" onClick={this.props.addMember}>
                            <ListItemAvatar data-option="invite">
                                <Avatar data-option="invite">
                                    <AddIcon data-option="invite" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={intl.formatMessage({ id: "dialogs.members.add" })} />
                        </ListItem>
                    </List>
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    injectIntl,
    connect(mapStateToProps),
    withStyles(styles),
)(MembersDialog);