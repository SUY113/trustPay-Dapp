import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import './AdvancePaymentResponse.css';

function AdvancePaymentResponse() {
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [requestID, setRequestID] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedOrgName = localStorage.getItem('orgName');
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    await axios.post('http://localhost:3000/respond-request', {
        userName : userName,
        orgName : orgName,
        requestID: requestID,
        response: response
      });

      setSuccessMessage('Response submitted successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to submit response.');
      setSuccessMessage('');
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard-Staff');
  };

  return (
    <div className="response-form-container">
      <h2>Submit Response</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập:
          <input type="text" value={userName} readOnly />
        </label>
        <label>
          Tổ chức:
          <input type="text" value={orgName} readOnly />
        </label>
        <label>
          Request ID:
          <input
            type="text"
            value={requestID}
            onChange={(e) => setRequestID(e.target.value)}
            required
          />
        </label>
        <label>
          Response:
          <select
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            required
          >
            <option value="">Select a response</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button type="submit">Submit Response</button>
      </form>
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
}

export default AdvancePaymentResponse;
