const Web3 = require("web3");

const initWeb3 = async () => {
  try {
    const web3Instance = new Web3(
      new Web3.providers.HttpProvider("http://localhost:5000")
    );
    console.log("Web3 instance initialized:", web3Instance);
    return web3Instance;
  } catch (error) {
    console.error("Failed to connect to the node:", error);
    return null;
  }
};

const loadContract = async () => {
  if (web3Contract && web3Contract.eth) {
    console.log(web3Contract);
    try {
      const accounts = "0xd5fabe7eaecc67fffbb016080d55bb4ff7ff9d11";
      web3Contract.eth.defaultAccount = accounts;
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

      const BalanceOfETH = web3Contract.eth.contract(BalanceOfETHABI);

      const deployedContract = BalanceOfETH.new([], {
        data: BalanceOfETHBytecode,
      });

      const myContract = BalanceOfETH.at(
        web3Contract.eth.getTransactionReceipt(deployedContract.transactionHash)
          .contractAddress
      );
      myContract.setBalance(balance);
      console.log("Balance of ETH:", myContract.getBalance());
      setMintAmount(myContract.getBalance());
    } catch (error) {
      console.error("Error interacting with the contract:", error);
    }
  } else {
    console.log("Web3 contract not initialized or eth object not available");
  }
};

export { initWeb3, loadContract };
