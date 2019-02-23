const HighestBidder = artifacts.require('./HighestBidder.sol')

contract('HighestBidder', accounts => {
  it('should initialise the contract values', function() {
    const highestBidder = await HighestBidder.deployed();
    const currentText = await highestBidder.currentText();
    const currentPrice = await highestBidder.currentPrice();

    assert.equal(currentText, '', 'currentText was not initialised to empty string');
    assert.equal(currentPrice, 0, 'currentPrice was not initialised to zero');
  });
});
