import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider } from 'react-intl';
import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

//custom translations
import { EN } from './Languages/en';
import { ZH_TW } from './Languages/zh-TW';
import "./index.css";
import App from "./components/App";
import store from "./store";
import registerServiceWorker from "./registerServiceWorker";

addLocaleData([...en, ...zh]);
const locale = navigator.language;

const languages = {
  "en": EN,
  "zh-TW": ZH_TW
};

const localeData = languages[locale];

ReactDOM.render(
  <IntlProvider locale={locale} messages={localeData}>
    <Provider store={store}>
      <App />
    </Provider>
  </IntlProvider>,
  document.getElementById("root")
);

registerServiceWorker();
