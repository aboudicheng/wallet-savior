import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAQPf9CF3mDk2bxpsQcC0UIOvXKVni1uVg",
    authDomain: "wallet-savior.firebaseapp.com",
    databaseURL: "https://wallet-savior.firebaseio.com",
    projectId: "wallet-savior",
    storageBucket: "wallet-savior.appspot.com",
    messagingSenderId: "1064291158207"
};

firebase.initializeApp(config);

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};