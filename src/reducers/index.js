import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import homeReducer from './home';
import historyReducer from './history'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  homeState: homeReducer,
  historyState: historyReducer,
});

export default rootReducer;
