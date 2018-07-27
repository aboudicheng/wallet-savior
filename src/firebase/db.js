import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    firstUse: true,
    wallets: [
      {
        money: 0,
        name: "My Wallet"
      },
    ],
    history: false,
  });

export const onceGetUsers = () =>
  db.ref('users').once('child_added');

// Other db APIs ...
