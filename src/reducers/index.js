import { combineReducers } from "redux";
import sessionReducer from "./session";
import userReducer from "./user";
import historyReducer from "./history";
import loginReducer from "./login";
import signupReducer from "./signup";
import languageReducer from "./language";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  historyState: historyReducer,
  loginState: loginReducer,
  signupState: signupReducer,
  languageState: languageReducer
});

export default rootReducer;
