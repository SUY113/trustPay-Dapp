// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EnrollAdmin from './components/Login/EnrollAdmin';
import LoginPage from './components/Login/Login';
import HomePage from './components/Homepage';
import InputInfoPage from './components/Database/InputInfoPage';
import Dashboard from './components/Database/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll-admin" element={<EnrollAdmin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/input-info" element={<InputInfoPage/>}/>
          <Route path="/dashboard"  element={<Dashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
