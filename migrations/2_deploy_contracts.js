var HighestBidder = artifacts.require("./HighestBidder.sol");

module.exports = function(deployer) {
  deployer.deploy(HighestBidder);
};
