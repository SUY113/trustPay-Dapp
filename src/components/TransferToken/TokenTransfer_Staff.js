import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TokenTransfer_Staff.css';

function TokenTransfer_Staff() {
  const [userName] = useState(localStorage.getItem('userName') || ''); 
  const [orgName] = useState(localStorage.getItem('orgName') || ''); 
  const [clientAccountID, setClientAccountID] = useState('');
  const [AccountIDReceive, setAccountIDReceive] = useState('');
  const [clientAccountBalance, setClientAccountBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch ClientAccountID and ClientAccountBalance on component mount
    fetchClientAccountID();
    fetchClientAccountBalance();
  }, []);

  const fetchClientAccountID = async () => {
    try {
      const response = await axios.post('http://localhost:3000/query-ID', {
        userName: userName,
        orgName: orgName
      });

      setClientAccountID(response.data.resultID);
    } catch (err) {
      console.error('Failed to fetch ClientAccountID:', err);
      setError('Failed to fetch ClientAccountID');
    }
  };

  const fetchClientAccountBalance = async () => {
    try {
      const response = await axios.post('http://localhost:3000/query-balance', {
        userName: userName,
        orgName: orgName
      });

      setClientAccountBalance(response.data.resultBalance);
    } catch (err) {
      console.error('Failed to fetch ClientAccountBalance:', err);
      setError('Failed to fetch ClientAccountBalance');
    }
  };
  
  const handleTransfer = async () => {
    setError('');
    setSuccess('');

    if (!clientAccountID || !amount || !AccountIDReceive) {
      setError('Please fetch Client Account ID, enter Account ID to receive and fill in Amount.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/token-transfer', {
        userName: userName,
        orgName: orgName,
        amount: amount,
        receive_address: AccountIDReceive
      });

      if (response.status === 200) {
        setSuccess('Transfer successful!');
        // Refresh balance after successful transfer
        fetchClientAccountBalance();
      } else {
        setError('Transfer failed. Please try again.');
      }
    } catch (err) {
      setError('Transfer failed. Please try again.');
    }
  };

  const handleReturn = () => {
    console.log('Returning to dashboardStaff...');
    navigate('/dashboard-Staff');
  };

  return (
    <div className="Staff-container">
      <header className="Staff-header">
        <h1>Staff</h1>
        <div className="Staff-form-group">
          <label>Transfer Token</label>
        </div>
        <div className="Staff-form-group">
          <label>AccountID:</label>
          <input
            type="text"
            value={clientAccountID}
            readOnly
          />
        </div>
        <div className="Staff-form-group">
          <label>AccountBalance:</label>
          <input
            type="text"
            value={clientAccountBalance}
            readOnly
          />
        </div>
        <div className="Staff-form-group">
          <label>Nhập AccountID muốn chuyển:</label>
          <input
            type="text"
            value={AccountIDReceive}
            onChange={(e) => setAccountIDReceive(e.target.value)}
          />
        </div>
        <div className="Staff-form-group">
          <label>Nhập amount muốn chuyển:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="Staff-return">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button onClick={handleTransfer}>Submit Transfer</button>
          <button onClick={handleReturn}>Return to Dashboard</button>
        </div>
      </header>
    </div>
  );
}

export default TokenTransfer_Staff;