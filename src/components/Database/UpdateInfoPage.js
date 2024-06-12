import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function UpdateInfoPage({ isOpen, onRequestClose, userName, orgName, userInfo, channel, onUpdateSuccess }) {
  const [age, setAge] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userInfo) {
      setAge(userInfo.age);
      setEthAddress(userInfo.ethaddress);
    }
  }, [userInfo]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/update-info', {
        userName: userName,
        orgName: orgName,
        name: userInfo.name,
        age: age,
        ethAddress: ethAddress,
        channel: channel
      });

      if (response.status === 200) {
        onUpdateSuccess();
        onRequestClose();
      } else {
        setErrorMessage('Cập nhật không thành công.');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setErrorMessage(`Đã xảy ra lỗi khi cập nhật thông tin: ${error.response.data.error}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Cập Nhật Thông Tin</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleUpdate}>
        <label>
          Age:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <label>
          EthAddress:
          <input type="text" value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} />
        </label>
        <button type="submit">Cập Nhật</button>
        <button type="button" onClick={onRequestClose}>Hủy</button>
      </form>
    </Modal>
  );
}

export default UpdateInfoPage;
