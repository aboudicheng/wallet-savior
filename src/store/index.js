import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import rootReducer from "../reducers";
import * as actions from "../constants/action_types";
import { EN } from '../Languages/en';
import { ZH_TW } from '../Languages/zh-TW';

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

const languages = {
  "en": EN,
  "zh-TW": ZH_TW
};

let locale = navigator.language;
//if the user's locale isn't one of the languages provided, set the default
//language to English
if (!languages.hasOwnProperty(locale)) {
  locale = "en";
}

/**
 * Check the user's language preference from its local storage.
 * If the user if using for the first time, set 
 */
const localLanguage = localStorage.getItem('lang');
if (!localLanguage) {
  localStorage.setItem('lang', locale)
}
else {
  locale = localLanguage;
}

const localeData = languages[locale];

store.dispatch({ type: actions.SET_LANGUAGE, language: locale, messages: localeData})

export default store;