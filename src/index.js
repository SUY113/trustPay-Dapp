import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// // App.js hoặc index.js
// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import App from './App'; // Hoặc component chính của bạn
// import './index.css';

// const Root = () => {
//   useEffect(() => {
//     // Xóa localStorage khi ứng dụng khởi động
//     localStorage.clear();
//   }, []);

//   return <App />;
// };

// ReactDOM.render(
//   <React.StrictMode>
//     <Root />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
