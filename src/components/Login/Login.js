import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import file CSS cho component này

function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gửi yêu cầu POST đến REST API để đăng nhập
      const response = await axios.post('http://localhost:3000/login', {
        userName: userName,
        password: password,
        orgName: selectedOrg
      });

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        // Chuyển hướng đến trang nhập thông tin người dùng sau khi đăng nhập thành công
        window.location.href = '/input-info';
      } else {
        // Hiển thị thông báo lỗi cho người dùng nếu không thành công
        setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (error) {
      // Xử lý lỗi
      console.error('Đã xảy ra lỗi:', error);
      // Hiển thị thông báo lỗi cho người dùng
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập:
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>
        <br />
        <label>
          Mật khẩu:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Chọn tổ chức:
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)}>
            <option value="">-- Chọn tổ chức --</option>
            <option value="Accountant">Accountant</option>
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
          </select>
        </label>
        <br />
        <button type="submit">Đăng nhập</button>
      </form>
      <Link to="/">
        <button type="button" className="back-to-home-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default LoginPage;
