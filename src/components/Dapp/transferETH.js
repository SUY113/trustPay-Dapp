import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./transferETH.css";

//Deploy lai smc sau.

const TransferETH = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [web3, setWeb3] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const navigate = useNavigate();
  const contractETHABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "getOwnerBalance",
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
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "recipient",
          type: "address",
        },
      ],
      name: "sendEth",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];
  const contractETHAddress = "0x762bcAE540A14C5f7bBEeffDb6d7CF808D4D9D87";

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        const web3Instance = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
        );
        setWeb3(web3Instance);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3) {
        web3.eth.getAccounts((err, accounts) => {
          if (err) {
            console.error("Error fetching accounts:", err);
            return;
          }
          setAccount(accounts[0]);
          const contractETHInstance = web3.eth
            .contract(contractETHABI)
            .at(contractETHAddress);

          contractETHInstance.getOwnerBalance((err, balanceOwner) => {
            if (err) {
              console.error("Error fetching balance:", err);
              return;
            }
            const balanceOwnerInEther = web3.fromWei(balanceOwner, "ether");
            setBalance(balanceOwnerInEther);
          });
        });
      }
    };

    loadBlockchainData();
  }, [web3, contractETHABI]);

  const sendEther = () => {
    if (web3) {
      const contractETHInstance = web3.eth
        .contract(contractETHABI)
        .at(contractETHAddress);

      contractETHInstance.sendEth.sendTransaction(
        recipientAddress,
        {
          from: account,
          value: web3.toWei(ethAmount, "ether"),
          gas: 300000,
        },
        (error, result) => {
          if (!error) {
            console.log("Transaction hash:", result);
          } else {
            console.error("Error sending Ether:", error);
          }
        }
      );
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard-Accountant");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>ETH Transfer</h1>
      </div>
      <div className="address">
        <h2>Account Address</h2>
        <p>{account ? account : "Loading..."}</p>
      </div>
      <div className="balance">
        <h2>Owner Balance</h2>
        <p>{balance ? `${balance} ETH` : "Loading..."}</p>
      </div>
      <div className="send-eth">
        <h2>Send Ether</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
        <button onClick={sendEther}>Send ETH</button>
      </div>
      <div>
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default TransferETH;
