import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DashboardManager.css';

function DashboardManager() {
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [channel, setChannel] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedOrgName = localStorage.getItem('orgName');
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);
      setChannel(getChannelForOrg(storedOrgName));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getChannelForOrg = (orgName) => {
    switch (orgName) {
      case 'Accountant':
        return 'staffaccountant';
      case 'Staff':
        return 'staffstaff';
      case 'Manager':
        return 'accountantmanager';
      default:
        return '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/query-user', {
        userName: userName,
        orgName: orgName,
        channel: channel
      });

      setUserInfo(JSON.parse(response.data.result));
      setErrorMessage('');
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setErrorMessage('Đã xảy ra lỗi khi truy vấn thông tin người dùng.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="query-form">
        <h2>Truy Vấn Thông Tin Người Dùng Manager</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Tên đăng nhập:
            <input type="text" value={userName} readOnly />
          </label>
          <label>
            Tổ chức:
            <input type="text" value={orgName} readOnly />
          </label>
          <button type="submit">Truy Vấn</button>
        </form>
        {userInfo ? (
          <div className="user-info">
            <h3>Thông Tin Người Dùng:</h3>
            <p><strong>ID:</strong> {userInfo.id}</p>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Age:</strong> {userInfo.age}</p>
            <p><strong>Org:</strong> {userInfo.org}</p>
            <p><strong>EthAddress:</strong> {userInfo.ethaddress}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="actions">
        <button type="button">X</button>
        <button type="button">X</button>
        <button type="button">X</button>
        <Link to="/">
          <button type="button" className="back-to-home-button">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardManager;
