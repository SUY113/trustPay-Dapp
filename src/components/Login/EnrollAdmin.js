// src/EnrollAdmin.js
import React, { useState } from 'react';
import RegisterUser from './RegisterUser';
import './EnrollAdmin.css';

const EnrollAdmin = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [message, setMessage] = useState('');
  const [showRegisterUser, setShowRegisterUser] = useState(false);

  const handleEnrollAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/enroll-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgName: selectedOrg }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleShowRegisterUser = () => {
    setShowRegisterUser(true);
  };

  const handleBack = () => {
    setShowRegisterUser(false);
    setMessage('');
  };

  return (
    <div className="enroll-container">
      {!showRegisterUser ? (
        <form onSubmit={handleEnrollAdmin}>
          <h2>Enroll Admin</h2>
          <div className="form-group">
            <label>Select Org</label>
            <select 
              value={selectedOrg} 
              onChange={(e) => setSelectedOrg(e.target.value)} 
              required
            >
              <option value="">--Select a Org--</option>
              <option value="Accountant">Accountant</option>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <button type="submit">Enroll Admin</button>
          {message && <p>{message}</p>}
          {message && !showRegisterUser && (
            <button type="button" onClick={handleShowRegisterUser}>
              Go to Register User
            </button>
          )}
        </form>
      ) : (
        <RegisterUser orgName={selectedOrg} onBack={handleBack} />
      )}
    </div>
  );
};

export default EnrollAdmin;
