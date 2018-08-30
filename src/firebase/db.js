import { db } from "./firebase";

// User API

export const doCreateUser = (id, username, email, photo) => {
  //change default wallet name according to user's language
  let name;
  switch (localStorage.getItem('lang')) {
    case "en":
      name = "My Wallet";
      break;
    case "zh-TW":
      name = "我的錢包";
      break;
    default: return;
  }

  db.ref(`users/${id}`).set({
    username,
    email,
    photo,
    firstUse: true,
    wallets: [
      {
        money: 0,
        name
      },
    ],
    history: false,
  });
}

export const onceGetUsers = () =>
  db.ref("users").once("child_added");

// Other db APIs ...
