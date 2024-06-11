import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
function Dashboard() {
    const [userName, setUserName] = useState('');
    const [orgName, setOrgName] = useState('Accountant');
    const [channel, setChannel] = useState('staffaccountant');
    const [userInfo, setUserInfo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
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
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </label>
          <label>
            Tổ chức:
            <select value={orgName} onChange={(e) => setOrgName(e.target.value)}>
              <option value="Accountant">Accountant</option>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
            </select>
          </label>
          <label>
            Kênh:
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="staffaccountant">StaffAccountant</option>
              <option value="accountantmanager">AccountantManager</option>
              <option value="staffstaff">StaffStaff</option>
            </select>
          </label>
          <button type="submit">Truy Vấn</button>
        </form>
        {userInfo && (
          <div>
            <h3>Thông Tin Người Dùng:</h3>
            <p>{userInfo}</p>
          </div>
        )}
      </div>
    );
}

export default Dashboard;
