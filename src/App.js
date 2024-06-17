// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EnrollAdmin from './components/Login/EnrollAdmin';
import LoginPage from './components/Login/Login';
import HomePage from './components/Homepage';
import InputInfoPage from './components/Database/InputInfoPage';
import DashboardStaff from './components/Database/DashboardStaff';
import DashboardAccountant from './components/Database/DashboardAccountant';
import DashboardManager from './components/Database/DashboardManager';
import AdvancePaymentRequest from './components/Multisign/AdvancePaymentRequest';
import AdvancePaymentResponse from './components/Multisign/AdvancePaymentResponse';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll-admin" element={<EnrollAdmin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/input-info" element={<InputInfoPage/>}/>
          <Route path="/dashboard-Staff" element={<DashboardStaff/>}/>
          <Route path="/dashboard-Accountant" element={<DashboardAccountant/>}/>
          <Route path="/dashboard-Manager" element={<DashboardManager/>}/>
          <Route path="/advance-payment-request" element={<AdvancePaymentRequest/>}/>
          <Route path="/advance-payment-response" element={<AdvancePaymentResponse/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
