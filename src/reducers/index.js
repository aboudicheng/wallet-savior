import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import historyReducer from './history'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  historyState: historyReducer,
});

export default rootReducer;
