import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './InputInfoPage.css'; // Import file CSS cho component này

function InputInfoPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [channel, setChannel] = useState('');
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedOrgName = localStorage.getItem('orgName');
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);

      // Xác định kênh dựa trên tổ chức
      switch (storedOrgName) {
        case 'Accountant':
          setChannel('staffaccountant');
          break;
        case 'Staff':
          setChannel('staffstaff');
          break;
        case 'Manager':
          setChannel('accountantmanager');
          break;
        default:
          setChannel('');
          break;
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/input-info', {
        userName: userName,
        orgName: orgName,
        name: name,
        age: age,
        ethAddress: ethAddress,
        channel: channel
      });

      if (response.status === 200) {
        switch (orgName) {
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
      } else {
        setErrorMessage('Đã xảy ra lỗi khi lưu thông tin người dùng. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setErrorMessage('Đã xảy ra lỗi khi lưu thông tin người dùng. Vui lòng thử lại sau.');
    }
  };

  const generateAgeOptions = () => {
    const options = [];
    for (let i = 0; i < 100; i++) {
      const ageValue = i.toString().padStart(2, '0');
      options.push(
        <option key={i} value={ageValue}>{ageValue}</option>
      );
    }
    return options;
  };

  return (
    <div className="input-info-container">
      <h2>Nhập thông tin người dùng</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tên:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Tuổi:
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            {generateAgeOptions()}
          </select>
        </label>
        <br />
        <label>
          Địa chỉ ETH:
          <input type="text" value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} />
        </label>
        <br />
        <button type="submit">Lưu thông tin</button>
      </form>
      <Link to="/">
        <button type="button" className="back-to-home-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default InputInfoPage;
