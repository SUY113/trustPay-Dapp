import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import './AdvancePaymentRequest.css';

function AdvancePaymentRequest() {
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [requestID, setRequestID] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [amountToken, setAmountToken] = useState('');
  const [evaluateRequestResult, setEvaluateRequestResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [finalizeRequestResult, setFinalizeRequestResult] = useState('');
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
    localStorage.setItem('targetAccount', targetAccount);
    localStorage.setItem('amountToken', amountToken);
    localStorage.setItem('requestId', requestID);
    event.preventDefault();

    try {
      await axios.post('http://localhost:3000/submit-request', {
        userName : userName,
        orgName : orgName,
        requestID: requestID,
        targetAccount: targetAccount,
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
      const res = await axios.post('http://localhost:3000/evaluate-request', {userName : userName,
        orgName : orgName, requestID: requestID });
      setEvaluateRequestResult(res.data.result);
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setEvaluateRequestResult(error.response.data.error);
      } else {
        setEvaluateRequestResult('An unexpected error occurred.');
      }
    }
  };

  const handleFinalizeRequest = async () => {
    try {
      const res = await axios.post('http://localhost:3000/finalize-request', { userName : userName,
        orgName : orgName, requestID: requestID  });
      setFinalizeRequestResult(res.data.result);
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setFinalizeRequestResult(error.response.data.error);
      } else {
        setFinalizeRequestResult('An unexpected error occurred.');
      }
    }
  };

  const handleShowRequestInfo = () => {
    setShowRequestInfo(true);
  };

  const handleBackClick = () => {
    navigate('/dashboard-Staff');
  };

  return (
    <div className="request-form-container">
      <h2>Submit Request Advance Payment</h2>
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
          Target Account:
          <input
            type="text"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
            required
          />
        </label>
        <label>
          Amount Token 
          <input
            type ="text"
            value={amountToken}
            onChange={(e) => setAmountToken(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Request</button>
      </form>
      <div>
      <button className="evaluate-request-button" onClick={handleEvaluateRequest}>Evaluate Request</button>
      <button className="finalize-request-button" onClick={handleFinalizeRequest}>Finalize Request</button>
      </div>
      {evaluateRequestResult && (
        <div className="result-message">
          <h3>Evaluate Request Result:</h3>
          <p>{evaluateRequestResult}</p>
        </div>
      )}
            {finalizeRequestResult && (
        <div className="result-message">
          <h3>Finalize Request Result:</h3>
          <p>{finalizeRequestResult}</p>
        </div>
      )}
      <div>
        <button className="detail-advande-payment" onClick={handleShowRequestInfo}>Thong tin yeu cau ung tien</button>
      </div>
      {showRequestInfo && (
        <div className="request-info">
          <h3>Request Information:</h3>
          <p>Client Account ID: {localStorage.getItem('clientAccountId')}</p>
          <p>Advance Token: {localStorage.getItem('advanceToken')}</p>
        </div>
      )}
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
}

export default AdvancePaymentRequest;
