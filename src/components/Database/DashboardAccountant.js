import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import UpdateInfoPage from "./UpdateInfoPage";
import "./DashboardAccountant.css";
import Web3 from "web3";

function DashboardAccountant() {
  const [userName, setUserName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [channel, setChannel] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEthExchangeInfoModalOpen, setIsEthExchangeInfoModalOpen] =
    useState(false);
  const [mintAmount, setMintAmount] = useState("");
  const navigate = useNavigate();
  const [, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);

  const BalanceOfETHABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_ethTransferAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "retrieveOwnerBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const BalanceOfETHABIAddress = "0xe582B3DF22aa33a7C8d0cF28C97f560f3f829aC0";

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedOrgName = localStorage.getItem("orgName");
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);
      setChannel(getChannelForOrg(storedOrgName));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (typeof window.web3 !== "undefined") {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        const web3Instance = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
        );
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
            console.error("Error fetching accounts:", err);
            return;
          }
          setAccount(accounts[0]);

          // web3.eth.getBalance(accounts[0], (err, balanceWei) => {
          //   if (err) {
          //     console.error("Error fetching balance:", err);
          //     return;
          //   }
          //   const balanceInEther = Math.floor(
          //     web3.fromWei(balanceWei, "ether")
          //   );
          //   setMintAmount(balanceInEther.toString());
          // });

          const BalanceOfETHInstance = web3.eth
            .contract(BalanceOfETHABI)
            .at(BalanceOfETHABIAddress);

          BalanceOfETHInstance.retrieveOwnerBalance((err, balanceWei) => {
            if (err) {
              console.error("Error fetching balance:", err);
              return;
            }
            const balanceInEther = Math.floor(
              web3.fromWei(balanceWei, "ether")
            );
            setMintAmount(balanceInEther.toString());
          });
        });
      }
    };

    fetchAccountInfo();
  }, [web3]);

  const getChannelForOrg = (orgName) => {
    switch (orgName) {
      case "Accountant":
        return "staffaccountant";
      case "Staff":
        return "staffstaff";
      case "Manager":
        return "accountantmanager";
      default:
        return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/query-user", {
        userName: userName,
        orgName: orgName,
        channel: channel,
      });

      setUserInfo(JSON.parse(response.data.result));
      setErrorMessage("");
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setErrorMessage("Đã xảy ra lỗi khi truy vấn thông tin người dùng.");
    }
  };

  const handleUpdateClick = () => {
    if (userInfo) {
      setIsUpdateModalOpen(true);
    } else {
      setErrorMessage(
        "Vui lòng truy vấn thông tin người dùng trước khi cập nhật."
      );
    }
  };

  const handleUpdateSuccess = () => {
    handleSubmit(new Event("submit"));
  };

  const handleMintToken = async () => {
    try {
      const response = await axios.post("http://localhost:3000/token-mint", {
        userName: userName,
        orgName: orgName,
        amount: mintAmount,
      });

      console.log("Mint token success:", response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setErrorMessage("Đã xảy ra lỗi khi mint token.");
    }
  };

  const handleEthTransfer = () => {
    navigate("/transfer-eth");
  };

  const handleEthExchangeInfoClick = () => {
    setIsEthExchangeInfoModalOpen(true);
  };

  const handlePaySalaryClick = () => {
    navigate("/transferToken-Accountant");
  };

  return (
    <div className="dashboard-container">
      <div className="query-form">
        <h2>Truy Vấn Thông Tin Người Dùng Accountant</h2>
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
            <p>
              <strong>ID:</strong> {userInfo.id}
            </p>
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Age:</strong> {userInfo.age}
            </p>
            <p>
              <strong>Org:</strong> {userInfo.org}
            </p>
            <p>
              <strong>EthAddress:</strong> {userInfo.ethaddress}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="actions">
        <div className="mint-container">
          <button type="button" onClick={handleMintToken}>
            MintToken
          </button>
          <input type="text" value={mintAmount} readOnly />
        </div>
        <button type="button" onClick={handlePaySalaryClick}>
          {" "}
          Pay Salary{" "}
        </button>
        <button type="button" onClick={handleEthTransfer}>
          ETH Transfer
        </button>
        <button type="button" onClick={handleUpdateClick}>
          Update
        </button>
        <button type="button" onClick={handleEthExchangeInfoClick}>
          Xem thông tin đổi ETH
        </button>
        <Link to="/">
          <button type="button" className="back-to-home-button">
            Back to Home
          </button>
        </Link>
      </div>
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

      <Modal
        isOpen={isEthExchangeInfoModalOpen}
        onRequestClose={() => setIsEthExchangeInfoModalOpen(false)}
        contentLabel="ETH Exchange Info Modal"
      >
        <h3>Thông Tin Đổi ETH</h3>
        <p>
          <strong>Địa chỉ ETH:</strong> {localStorage.getItem("ethAddress")}
        </p>
        <p>
          <strong>Ten nguoi doi ETH:</strong> {localStorage.getItem("Name")}
        </p>
        <p>
          <strong>Ten nguoi doi ETH:</strong> {localStorage.getItem("Org")}
        </p>
        <p>
          <strong>Số lượng token:</strong> {localStorage.getItem("tokenAmount")}
        </p>
        <button
          type="button"
          onClick={() => setIsEthExchangeInfoModalOpen(false)}
        >
          Đóng
        </button>
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

export default DashboardAccountant;
