import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import homeReducer from './home'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  homeState: homeReducer,
});

export default rootReducer;
