import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import UpdateInfoPage from './UpdateInfoPage';
import './DashboardStaff.css';

Modal.setAppElement('#root');

function DashboardStaff() {
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [channel, setChannel] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState('');
  const [isEthExchangeModalOpen, setIsEthExchangeModalOpen] = useState(false);
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

  const handleUpdateClick = () => {
    if (userInfo) {
      setIsUpdateModalOpen(true);
    } else {
      setErrorMessage('Vui lòng truy vấn thông tin người dùng trước khi cập nhật.');
    }
  };

  const handleUpdateSuccess = () => {
    handleSubmit(new Event('submit'));
  };

  const handleAdvancePaymentClick = () => {
    if (userName.toLowerCase() === 'admin') {
      navigate('/advance-payment-request');
    } else {
      navigate('/advance-payment-response');
    }
  };

  const handleEthProfile = () => {
    navigate('/eth-profile');
  };

  const handleEthExchangeClick = () => {
    if (userInfo) {
      setIsEthExchangeModalOpen(true);
    } else {
      setErrorMessage('Vui lòng truy vấn thông tin người dùng trước khi đổi ETH.');
    }
  };

  const handleTransferTokenClick = () => {
    if (userInfo) {
      localStorage.setItem('transferTokenStaffUserName', userInfo.name);
      localStorage.setItem('transferTokenStaffOrg', userInfo.org);
      navigate("/transferToken-Staff");
    } else {
      setErrorMessage('Vui lòng truy vấn thông tin người dùng trước khi chuyển.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="query-form">
        <h2>Truy Vấn Thông Tin Người Dùng Staff</h2>
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
        <button type="button" onClick={handleAdvancePaymentClick}>Trả lời/yêu cầu ứng tiền</button>
        <button type="button" onClick={handleTransferTokenClick}>Chi tiêu</button>
        <button type="button" onClick={handleEthExchangeClick}>Đổi ETH</button>
        <button type="button" onClick={handleUpdateClick}>Update</button>
        <button type="button" onClick={handleEthProfile}>ETH Wallet</button>
        <Link to="/">
          <button type="button" className="back-to-home-button">Back to Home</button>
        </Link>
      </div>

      <Modal
        isOpen={isEthExchangeModalOpen}
        onRequestClose={() => setIsEthExchangeModalOpen(false)}
        contentLabel="ETH Exchange Modal"
      >
        <h3>Đổi ETH</h3>
        <p><strong>Địa chỉ ETH:</strong> {userInfo ? userInfo.ethaddress : ''}</p>
        <p><strong>Ten nguoi doi:</strong> {userInfo ? userInfo.name : ''}</p>
        <p><strong>To chuc thuoc ve:</strong> {userInfo ? userInfo.org : ''}</p>

        <label>
          Số lượng token:
          <input type="number" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />
        </label>
        <button type="button" onClick={() => {
          // Chuyển dữ liệu ETH Address, tokenAmount, userInfo.name, và userInfo.org sang bộ nhớ cục bộ (local storage)
          localStorage.setItem('ethAddress', userInfo.ethaddress);
          localStorage.setItem('tokenAmount', tokenAmount);
          localStorage.setItem('Name', userInfo.name);
          localStorage.setItem('Org', userInfo.org);
          navigate('/transferToken-Staff');
        }}>Chuyển đổi</button>
        <button type="button" onClick={() => setIsEthExchangeModalOpen(false)}>Đóng</button>
      </Modal>

      {isUpdateModalOpen && (
        <UpdateInfoPage
          isOpen={isUpdateModalOpen}
          onRequestClose={() => setIsUpdateModalOpen(false)}
          userName={userName}
          orgName={orgName}
          userInfo={userInfo}
          channel={channel}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default DashboardStaff;
