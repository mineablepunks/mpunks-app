import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider, GlobalStyle } from "@react95/core";
import StyleBase from "./styles/global";
import { BrowserRouter } from "react-router-dom";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ThemeProvider>
            <GlobalStyle />
            <StyleBase />
            <App />
          </ThemeProvider>
        </Web3ReactProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
