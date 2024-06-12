import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import file CSS cho component này

function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        userName: userName,
        password: password,
        orgName: selectedOrg
      });

      if (response.status === 200) {
        // Lưu thông tin vào localStorage
        localStorage.setItem('userName', userName);
        localStorage.setItem('orgName', selectedOrg);

        // Hỏi người dùng muốn chuyển đến trang nào
        const wantToGoToInputInfo = window.confirm('Bạn chưa nhập thông tin cá nhân ?');
        if (wantToGoToInputInfo) {
          navigate('/input-info');
        } else {
          switch (selectedOrg) {
            case 'Accountant':
              navigate('/dashboard-Accountant');
              break;
            case 'Staff':
              navigate('/dashboard-Staff');
              break;
            case 'Manager':
              navigate('/dashboard-Manager');
              break;
            default:
              setErrorMessage('Tổ chức không hợp lệ.');
              break;
          }
        }
      } else {
        setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
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
