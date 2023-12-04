import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import StockTracker from './Components/StockTracker';

const root = ReactDOM.createRoot(document.getElementById('root'));
//const dotenv = require("dotenv")
//dotenv.config()
root.render(
  <React.StrictMode>
    <StockTracker />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
