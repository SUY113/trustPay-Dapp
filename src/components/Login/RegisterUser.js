// src/RegisterUser.js
import React, { useState } from 'react';
import './RegisterUser.css';

const RegisterUser = ({ orgName, onBack }) => {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, orgName }),
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

  return (
    <div className="register-container">
      <form onSubmit={handleRegisterUser}>
        <h2>Register User for {orgName}</h2>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Register User</button>
        <button type="button" onClick={onBack}>Back</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterUser;
