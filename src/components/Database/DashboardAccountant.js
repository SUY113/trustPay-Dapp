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
  const [, setAccountEth] = useState("");
  const [web3Eth, setWeb3Eth] = useState(null);
  const [web3Contract, setWeb3Contract] = useState(null);
  const [balance, setBalance] = useState(0);

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
    const loadWeb3Eth = async () => {
      if (typeof window.web3 !== "undefined") {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3Eth(web3Instance);
      } else {
        const web3Instance = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
        );
        setWeb3Eth(web3Instance);
      }
    };
    loadWeb3Eth();
  }, []);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (web3Eth) {
        web3Eth.eth.getAccounts((err, accounts) => {
          if (err) {
            console.error("Error fetching accounts:", err);
            return;
          }
          setAccountEth(accounts[0]);
          // get balance
          web3Eth.eth.getBalance(accounts[0], (err, balanceWei) => {
            if (err) {
              console.error("Error fetching balance:", err);
              return;
            }
            const balanceInEther = Math.floor(
              web3Eth.fromWei(balanceWei, "ether")
            );
            setBalance(balanceInEther);
            //setMintAmount(balance.toString());
          });
        });
      }
    };
    fetchAccountInfo();
  }, [web3Eth]);

  useEffect(() => {
    const loadWeb3Contract = async () => {
      try {
        const web3Instance = new Web3(
          new Web3.providers.HttpProvider("http://localhost:5000")
        );
        setWeb3Contract(web3Instance);
      } catch (error) {
        console.error("Failed to connect to the node:", error);
      }
    };
    loadWeb3Contract();
  }, []);

  useEffect(() => {
    const loadContract = async () => {
      if (web3Contract && web3Contract.eth) {
        try {
          web3Contract.eth.defaultAccount = await web3Contract.eth.accounts[0];
          const BalanceOfETHABI = [
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "setBalance",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "getBalance",
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

          const BalanceOfETHBytecode =
            "608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806312065fe0146037578063fb1669ca146051575b600080fd5b603d6069565b6040516048919060c2565b60405180910390f35b6067600480360381019060639190608f565b6072565b005b60008054905090565b8060008190555050565b60008135905060898160e5565b92915050565b60006020828403121560a057600080fd5b600060ac84828501607c565b91505092915050565b60bc8160db565b82525050565b600060208201905060d5600083018460b5565b92915050565b6000819050919050565b60ec8160db565b811460f657600080fd5b5056fea2646970667358221220368d41917c426e40ea507231b18db146b0116d1581fc3781d82c3432448aa97e64736f6c63430008030033";

          const BalanceOfETH = new web3Contract.eth.Contract(BalanceOfETHABI);
          const deployedContract = await BalanceOfETH.deploy({
            data: BalanceOfETHBytecode,
          })
            .send({ from: web3Contract.eth.defaultAccount })
            .on("receipt", (receipt) => {
              console.log(
                "Contract deployed successfully:",
                receipt.contractAddress
              );
            })
            .on("error", (error) => {
              console.error("Error deploying contract:", error);
              throw error; // Rethrow after logging
            });

          const contractAddress = deployedContract.options.address;
          const myContract = new web3Contract.eth.Contract(
            BalanceOfETHABI,
            contractAddress
          );

          await myContract.methods
            .setBalance(balance)
            .send({ from: web3Contract.eth.defaultAccount })
            .on("receipt", (receipt) => {
              console.log("Transaction successful:", receipt);
            })
            .on("error", (error) => {
              console.error("Error in transaction:", error);
              throw error; // Rethrow after logging
            });

          const result = await myContract.methods.getBalance().call();
          console.log("Balance:", result.toString());
          setMintAmount(result.toString());
        } catch (error) {
          console.error("Error interacting with the contract:", error);
        }
      }
    };
    loadContract();
  }, [web3Contract]);

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
