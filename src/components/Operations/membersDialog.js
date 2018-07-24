import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import blue from '@material-ui/core/colors/blue';
import * as firebase from 'firebase/app'

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class MembersDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
            members: [],
        }
    }

    componentDidMount() {
        firebase.database().ref(`groups/${this.props.groupId}/member`).once('value', snapshot => {
            snapshot.val().map(id => {
                return (
                    firebase.database().ref(`users/${id}/email`).once('value', s => {
                        this.setState(prevState => ({
                            members: [...prevState.members, s.val()]
                        }))
                    })
                )
            })
        })
    }

    render() {
        const { members } = this.state
        const { classes } = this.props;

        //TODO: onClick range
        return (
            <Dialog
                open={this.props.open}
                onClose={() => { this.props.handleClose(false); this.props.handleMenuClose(null) }}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title">Members</DialogTitle>
                <div>
                    <List>
                        {members.length > 0 &&
                            members.map(email => (
                                <ListItem key={email}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={email} />
                                </ListItem>
                            ))}
                        <ListItem button data-option="invite" onClick={this.props.addMember}>
                            <ListItemAvatar data-option="invite">
                                <Avatar data-option="invite">
                                    <AddIcon data-option="invite" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="add member" />
                        </ListItem>
                    </List>
                </div>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
)(MembersDialog);