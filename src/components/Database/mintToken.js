const Web3 = require("web3");

function mintToken(balance) {
  const web3Contract = new Web3(
    new Web3.providers.HttpProvider("http://localhost:5000")
  );
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

  web3Contract.eth.defaultAccount =
    "0xd5fabe7eaecc67fffbb016080d55bb4ff7ff9d11";
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
                  console.log("Current Balance:", balance.toNumber());
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
      console.log("Successfully set balance. Current Balance:", mintBalance);
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
