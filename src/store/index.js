import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import rootReducer from "../reducers";
import * as actions from "../constants/action_types";
import { EN } from '../Languages/en';
import { ZH_TW } from '../Languages/zh-TW';

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

const locale = navigator.language;

const languages = {
  "en": EN,
  "zh-TW": ZH_TW
};

const localeData = languages[locale];

function get_language(locale) {
  const dash_index = locale.indexOf('-')
  if (dash_index >= 0) {
    return locale.substring(0, dash_index)
  }
  return locale
}

store.dispatch({ type: actions.SET_LANGUAGE, language: get_language(locale), messages: localeData})

export default store;