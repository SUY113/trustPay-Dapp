import React, { useState } from 'react';
import axios from 'axios';
import './AdvancePaymentRequest.css';

function AdvancePaymentRequest() {
  const [requestID, setRequestID] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:3000/submit-request', {
        requestID: requestID,
        targetAccount: targetAccount,
        message: message
      });

      setSuccessMessage('Request submitted successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to submit request.');
      setSuccessMessage('');
    }
  };

  const handleEvaluateRequest = async () => {
    try {
      const res = await axios.post('http://localhost:3000/evaluate-request', { requestID });
      setMessage(res.data.result);
    } catch (error) {
      setMessage(error.res.data.error);
    }
  };

  const handleFinalizeRequest = async () => {
    try {
      const res = await axios.post('http://localhost:3000/finalize-request', { requestID });
      setMessage(res.data.result);
    } catch (error) {
      setMessage(error.res.data.error);
    }
  };

  return (
    <div className="request-form-container">
      <h2>Submit Request</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
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
          Target Account:
          <input
            type="text"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
            required
          />
        </label>
        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Request</button>
      </form>
      <div>
      <button className="evaluate-request-button" onClick={handleEvaluateRequest}>Evaluate Request</button>
      <button className="finalize-request-button" onClick={handleFinalizeRequest}>Finalize Request</button>
      </div>
    </div>
  );
}

export default AdvancePaymentRequest;