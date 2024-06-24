import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import './TokenTransferAccountant.css';

function TokenTransferAccountant() {
  const [userName] = useState(localStorage.getItem('userName') || ''); 
  const [orgName] = useState(localStorage.getItem('orgName') || ''); 
  const [clientAccountID, setClientAccountID] = useState('');
  const [AccountIDReceive, setAccountIDReceive] = useState('');
  const [clientAccountBalance, setClientAccountBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isReceiveSalaryOpen, setisReceiveSalaryOpen] = useState(false);
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
      localStorage.setItem('AccountantID', response.data.resultID);
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
    console.log('Returning to dashboardAccountant...');
    navigate('/dashboard-Accountant');
  };

  const handleReceiveSalaryClick = () => {
    setisReceiveSalaryOpen(true);
  };

return (
    <div className="Accountant-container">
      <header className="Accountant-header">
        <h1>Accountant</h1>
        <div className="Accountant-form-group">
          <label>Transfer Token</label>
        </div>
        <div className="Accountant-form-group">
          <label>AccountID:</label>
          <input
            type="text"
            value={clientAccountID}
            readOnly
          />
        </div>
        <div className="Accountant-form-group">
          <label>AccountBalance:</label>
          <input
            type="text"
            value={clientAccountBalance}
            readOnly
          />
        </div>
        <div className="Accountant-form-group">
          <label>Nhap AccountID muon chuyen:</label>
          <input
            type="text"
            value={AccountIDReceive}
            onChange={(e) => setAccountIDReceive(e.target.value)}
          />
        </div>
        <div className="Accountant-form-group">
          <label>Nhap amount muon chuyen:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="Accountant-return">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button onClick={handleTransfer}>Submit Transfer</button>
          <button onClick={handleReturn}>Return to Dashboard</button>
          <button type="button" onClick={handleReceiveSalaryClick}> Xem thong tin nguoi nhan luong</button>
        </div>
        <Modal
            isOpen ={isReceiveSalaryOpen}
            onRequestClose = {() => setisReceiveSalaryOpen(false)}
            conentLabel = "Receive Salary Modal"
        >
            <h3>Thong tin nguoi nhan luong</h3>
            <p><strong>Ten nguoi nhan luong </strong>{localStorage.getItem('nameReceive')}</p>
            <p><strong>Ten to chuc nguoi nhan</strong>{localStorage.getItem('orgReceive')}</p>
            <p><strong>Dia chi nguoi nhan </strong>{localStorage.getItem('clientAccountId')}</p>
            <button type="button" onClick={() => setisReceiveSalaryOpen(false)}>Dong</button>
        </Modal>
      </header>
    </div>
  );
}



export default TokenTransferAccountant;