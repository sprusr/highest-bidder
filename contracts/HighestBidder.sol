pragma solidity ^0.5.0;

contract HighestBidder {
    string public currentText;
    uint public currentPrice;
    address owner;

    constructor() public {
        currentText = "";
        currentPrice = 0;
        owner = msg.sender;
    }

    function bid(string memory newText) public payable {
        require(msg.value > currentPrice, "bid-too-low");
        currentText = newText;
        currentPrice = msg.value;
    }

    function admin(string memory newText, uint newPrice) public {
        require(msg.sender == owner, "sender-not-admin");
        currentText = newText;
        currentPrice = newPrice;
    }
}
