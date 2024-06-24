import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import './TokenTransferStaff.css';

function TokenTransferStaff() {
  const [userName] = useState(localStorage.getItem('userName') || ''); 
  const [orgName] = useState(localStorage.getItem('orgName') || ''); 
  const [clientAccountID, setClientAccountID] = useState('');
  const [AccountIDReceive, setAccountIDReceive] = useState('');
  const [clientAccountBalance, setClientAccountBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isReceiveSalaryOpen, setisReceiveSalaryOpen] = useState(false);
  const [isAdvancePaymentOpen, setIsAdvancePaymentOpen] = useState(false);
  const [advanceToken, setAdvanceToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nameInfo, setNameInfo] = useState('');
  const [orgInfo, setOrgInfo] = useState ('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch ClientAccountID and ClientAccountBalance on component mount
    fetchClientAccountID();
    fetchClientAccountBalance();
    const storedNameInfo = localStorage.getItem('transferTokenStaffUserName');
    const storedOrgInfo = localStorage.getItem('transferTokenStaffOrg');
    if (storedNameInfo && storedOrgInfo) {
      setNameInfo(storedNameInfo);
      setOrgInfo(storedOrgInfo);
    }


    const storedAccountIDReceive = localStorage.getItem('AccountIDToTransfer');
    const storedAmount = localStorage.getItem('AmountToTransfer');
    const storedAccountantID = localStorage.getItem('AccountantID');
    const storedTokenAmount = localStorage.getItem('tokenAmount');
    if (storedAccountIDReceive && storedAmount) {
      setAccountIDReceive(storedAccountIDReceive);
      setAmount(storedAmount);
    }
    if(storedAccountantID){
      setAccountIDReceive(storedAccountantID)
      setAmount(storedTokenAmount);
    }
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

        localStorage.setItem('AccountIDToTransfer', '');
        localStorage.setItem('AmountToTransfer', '');
        localStorage.setItem('AccountantID','');
        localStorage.setItem('tokenAmount','');
        setAccountIDReceive('');
        setAmount('');
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

  const handleReceiveSalaryClick = () => {
    if (clientAccountID) {
        setisReceiveSalaryOpen(true);
    } else {
        setErrorMessage('Error');
    }
  };
  
  const handleAdvancePaymentClick = () => {
    if (clientAccountID) {
      setIsAdvancePaymentOpen(true);
    } else {
      setErrorMessage('Error');
    }
  };


  return (
    <div className="Staff-container">
      <header className="Staff-header">
        <h1>Staff</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
          <button onClick={handleReceiveSalaryClick}>Receive Salary</button>
          <button onClick={handleAdvancePaymentClick}>Advance Payment</button>
        </div>

        <Modal
            isOpen = {isReceiveSalaryOpen}
            onRequestClose = {()=> setisReceiveSalaryOpen(false)}
            contentLabel = "Receive Salary Modal"
        >
            <h3>Yêu cầu nhận lương</h3>
            <p><strong>Tên người yêu cầu nhận:</strong> {nameInfo}</p>
            <p><strong>Tổ chức người yêu cầu nhận:</strong> {orgInfo}</p>
            <p><strong>Địa chỉ người yêu cầu:</strong> {clientAccountID}</p>
            <button type="button" onClick={() => {
                localStorage.setItem('clientAccountId', clientAccountID);
                localStorage.setItem('nameReceive', nameInfo);
                localStorage.setItem('orgReceive', orgInfo);
                setisReceiveSalaryOpen(false);
            }}>Yeu cau</button>
            <button type="button" onClick={() => setisReceiveSalaryOpen(false) }>Dong</button>
        </Modal>

        <Modal
             isOpen = {isAdvancePaymentOpen}  
             onRequestClose={() => setIsAdvancePaymentOpen(false)}
             contentLabel= "Advance Payment Modal"
        >
          <h3>Yêu cầu ứng tiền </h3>
            <p><strong>Tên người yêu cau ung tien:</strong> {nameInfo}</p>
            <p><strong>Tổ chức người yêu cầu ung tien</strong> {orgInfo}</p>
            <p><strong>Địa chỉ người yêu cầu ung tien:</strong> {clientAccountID}</p>
            <label>
              So tien muon ung 
              <input
               type ="text"
               value={advanceToken}
               onChange={(e) => setAdvanceToken(e.target.value)}
               required
              />
            </label>
            <button type="button" onClick={() => {
                localStorage.setItem('clientAccountIdReceive', clientAccountID);
                localStorage.setItem('advanceToken', advanceToken);
                setIsAdvancePaymentOpen(false);
            }}>Ung tien</button>
            <button type="button" onClick={() => setIsAdvancePaymentOpen(false)}>Đóng</button>
        </Modal>
      </header>
    </div>
  );
}

export default TokenTransferStaff;