import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [channel, setChannel] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedOrgName = localStorage.getItem('orgName');
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);
      // Xác định kênh dựa trên tổ chức
      setChannel(getChannelForOrg(storedOrgName));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Hàm để ánh xạ tổ chức sang kênh
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

      setUserInfo(response.data.result);
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setErrorMessage('Đã xảy ra lỗi khi truy vấn thông tin người dùng.');
    }
  };

  return (
    <div className="container">
      <h2>Truy Vấn Thông Tin Người Dùng</h2>
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
        {/* Ở đây, không hiển thị phần kênh */}
        <button type="submit">Truy Vấn</button>
      </form>
      {userInfo && (
        <div>
          <h3>Thông Tin Người Dùng:</h3>
          <p>{userInfo}</p>
        </div>
      )}
      <Link to="/">
        <button type="button" className="back-to-home-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default Dashboard;
