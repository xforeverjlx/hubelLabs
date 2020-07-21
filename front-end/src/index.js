import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Starting from './App';
import Recording from './Record';
import * as serviceWorker from './serviceWorker';

let url = new URL(window.location.href)
let body;
if (url.pathname === "/") {
  body = <Starting />
} else if (url.pathname === "/recording") {
  body = <Recording />
}
ReactDOM.render(
  <React.StrictMode>
    {body}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
