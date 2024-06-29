// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.2 <0.9.0;

contract MintTokenFabric {
    uint256 balance;

    function setBalance(uint256 value) public {
        balance = value;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }
}