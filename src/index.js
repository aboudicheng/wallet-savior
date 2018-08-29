import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

//custom translations

import "./index.css";
import App from "./components/App";
import store from "./store";
import registerServiceWorker from "./registerServiceWorker";
import ConnectedIntlProvider from './ConnectedIntlProvider';

addLocaleData([...en, ...zh]);

ReactDOM.render(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <App />
      </ConnectedIntlProvider>
    </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
