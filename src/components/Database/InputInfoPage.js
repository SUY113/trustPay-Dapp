// src/components/InputInfoPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay vì useHistory
import axios from 'axios';
import './InputInfoPage.css'; // Import file CSS cho component này

function InputInfoPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gửi yêu cầu POST đến REST API để lưu thông tin người dùng
      const response = await axios.post('YOUR_INPUT_INFO_REST_API_ENDPOINT', {
        name: name,
        age: age,
        ethAddress: ethAddress
      });

      // Sau khi lưu thành công, chuyển hướng đến trang chính
      navigate('/');
    } catch (error) {
      // Xử lý lỗi
      console.error('Đã xảy ra lỗi:', error);
      // Hiển thị thông báo lỗi cho người dùng
      setErrorMessage('Đã xảy ra lỗi khi lưu thông tin người dùng. Vui lòng thử lại sau.');
    }
  };

  const generateAgeOptions = () => {
    const options = [];
    for (let i = 0; i < 100; i++) {
      const ageValue = i.toString().padStart(2, '0'); // Đảm bảo có 2 chữ số cho mỗi tuổi
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
    </div>
  );
}

export default InputInfoPage;
