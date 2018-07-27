import { db } from './firebase';
import firebase from 'firebase/app';
import * as routes from './constants/routes';

export const signMethodHandler = (props) => {
    const user = props.res.user
    let found = false

    firebase.database().ref('users').once('value', snapshot => {

        for (let key in snapshot.val()) {

            //if user already exists then do login
            if (snapshot.val()[key].email === user.email) {
                found = true
                firebase.auth().signInAndRetrieveDataWithCredential(props.res.credential)
                    .then(() => {
                        props.initialize()

                        props.history.push(routes.HOME);
                    })
                    .catch(error => {
                        props.setError(error)
                    });
            }
        }

        //if user doesn't exist then do signup
        if (!found) {
            db.doCreateUser(user.uid, user.displayName, user.email)
                .then(() => {
                    props.initialize()
                    props.history.push(routes.HOME);
                })
                .catch(error => {
                    props.setError(error)
                });
        }
    })
}