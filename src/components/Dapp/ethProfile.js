import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate} from 'react-router-dom';
import './ethProfile.css'; // Import CSS file for styling

const EthProfile = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [web3, setWeb3] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3 = async () => {
      if (typeof window.web3 !== 'undefined') {
        // MetaMask is available
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        // MetaMask is not available, fallback to local node
        const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        setWeb3(web3Instance);
      }
    };

    loadWeb3();
  }, []);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (web3) {
        web3.eth.getAccounts((err, accounts) => {
          if (err) {
            console.error('Error fetching accounts:', err);
            return;
          }
          setAccount(accounts[0]);

          web3.eth.getBalance(accounts[0], (err, balanceWei) => {
            if (err) {
              console.error('Error fetching balance:', err);
              return;
            }
            // Convert balance from wei to ether manually
            const balanceInEther = web3.fromWei(balanceWei, 'ether');
            setBalance(balanceInEther.toString());
          });
        });
      }
    };

    fetchAccountInfo();
  }, [web3]);

  const handleBackClick = () => {
    navigate('/dashboard-Staff');
  };

  return (
    <div className="container">
      <h1>Ethereum Profile</h1>
      <div className="profile-info">
        <div>
          <h2>Account Address:</h2>
          <p>{account}</p>
        </div>
        <div>
          <h2>Current Balance:</h2>
          <p>{balance} ETH</p>
        </div>
      </div>
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default EthProfile;
