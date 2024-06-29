const Web3 = require("web3");

function mintToken(balance) {
  const web3Contract = new Web3(
    new Web3.providers.HttpProvider("http://localhost:5000")
  );
  //Thay doi theo remix
  const BalanceOfETHABI = [
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "setBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
//Thay doi theo remix
  const BalanceOfETHBytecode =
    "608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806312065fe01461003b578063fb1669ca14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220b8a174fcf4815eb46d3e254fc15178afce35b195f90ce42c579294a3e9ce689064736f6c634300080e0033";

  web3Contract.eth.defaultAccount =
    //Thay doi theo huong dan
    "0x863c557a03a209c34531bf6500502bd344dabaaa";
  const BalanceOfETH = web3Contract.eth.contract(BalanceOfETHABI);

  return new Promise((resolve, reject) => {
    BalanceOfETH.new(
      { data: BalanceOfETHBytecode },
      (err, deployedContract) => {
        if (err) {
          console.error("Error deploying contract:", err);
          reject(err);
          return;
        }

        console.log("Transaction Hash:", deployedContract.transactionHash);

        const checkTransactionReceipt = async (hash) => {
          let receipt = null;
          while (receipt === null) {
            try {
              receipt = await web3Contract.eth.getTransactionReceipt(hash);
            } catch (error) {
              console.error("Error fetching transaction receipt:", error);
              reject(error);
              return;
            }
            if (!receipt) {
              console.log("Waiting for transaction to be mined...");
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
          return receipt;
        };

        checkTransactionReceipt(deployedContract.transactionHash)
          .then((receipt) => {
            const myContract = BalanceOfETH.at(receipt.contractAddress);
            console.log("Contract Address:", receipt.contractAddress);

            myContract.setBalance(
              balance,
              { from: web3Contract.eth.defaultAccount },
              (err, txHash) => {
                if (err) {
                  console.error("Error setting balance:", err);
                  reject(err);
                  return;
                }
                console.log("Set Balance Transaction Hash:", txHash);

                myContract.getBalance((err, balance) => {
                  if (err) {
                    console.error("Error getting balance:", err);
                    reject(err);
                    return;
                  }
                  //console.log("Current Balance:", balance.toNumber());
                  resolve(balance.toNumber());
                });
              }
            );
          })
          .catch((error) => {
            console.error("Error in transaction processing:", error);
            reject(error);
          });
      }
    );
  });
}

function mintTokenUntilSuccess(balance) {
  return mintToken(balance)
    .then((mintBalance) => {
      //console.log("Successfully set balance. Current Balance:", mintBalance);
      return mintBalance.toString();
    })
    .catch((error) => {
      console.error("Error minting token:", error);
      console.log("Retrying...");
      return new Promise((resolve) =>
        setTimeout(() => resolve(mintTokenUntilSuccess(balance)), 7000)
      ); // Retry after 7 seconds
    });
}

module.exports = { mintToken, mintTokenUntilSuccess };