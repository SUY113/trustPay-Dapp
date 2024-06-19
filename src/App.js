// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EnrollAdmin from './components/Login/EnrollAdmin.js';
import LoginPage from './components/Login/Login.js';
import HomePage from './components/Homepage.js';
import InputInfoPage from './components/Database/InputInfoPage.js';
import DashboardStaff from './components/Database/DashboardStaff.js';
import DashboardAccountant from './components/Database/DashboardAccountant.js';
import DashboardManager from './components/Database/DashboardManager.js';
import TokenTransferAccountant from './components/Database/TokenTransfer_Accountant.js';
import TokenTransferStaff from './components/Database/TokenTransfer_Staff.js';
import AdvancePaymentRequest from './components/Multisign/AdvancePaymentRequest';
import AdvancePaymentResponse from './components/Multisign/AdvancePaymentResponse';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll-admin" element={<EnrollAdmin/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/input-info" element={<InputInfoPage/>}/>
          <Route path="/dashboard-Staff" element={<DashboardStaff/>}/>
          <Route path="/dashboard-Accountant" element={<DashboardAccountant/>}/>
          <Route path="/dashboard-Manager" element={<DashboardManager/>}/>
          <Route path="/transferToken-Accountant" element={<TokenTransferAccountant/>} />
          <Route path="/transferToken-Staff" element={<TokenTransferStaff/>} />
          <Route path="/advance-payment-request" element={<AdvancePaymentRequest/>}/>
          <Route path="/advance-payment-response" element={<AdvancePaymentResponse/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
