import React, { useState } from 'react';
import axios from 'axios';
import './AdvancePaymentResponse.css';

function AdvancePaymentResponse() {
 const [requestID, setRequestID] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    await axios.post('http://localhost:3000/respond-response', {
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

  return (
    <div className="response-form-container">
      <h2>Submit Response</h2>
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
    </div>
  );
}

export default AdvancePaymentResponse;
