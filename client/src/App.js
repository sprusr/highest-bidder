import React, { Component } from 'react';
import IPFS from 'ipfs';
import { Buffer } from 'buffer';
import HighestBidderContract from './contracts/HighestBidder.json';
import getWeb3 from './utils/getWeb3';

import './App.css';

class App extends Component {
  state = {
    currentText: '',
    currentPrice: '',
    newText: '',
    newPrice: '',
    loading: false,
    web3: null,
    accounts: null,
    contract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HighestBidderContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HighestBidderContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Load the IPFS node
      const ipfs = await new Promise((resolve, reject) => {
        const node = new IPFS();
        node.on('ready', () => {
          resolve(node);
        });
      });

      // Set ipfs, web3, accounts, and contract to the state, and then proceed
      // with an example of interacting with the contract's methods.
      this.setState({ ipfs, web3, accounts, contract: instance }, this.load);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  load = async () => {
    const { ipfs, contract } = this.state;

    this.setState({ loading: true });

    const currentTextHash = await contract.methods.currentText().call();
    const currentText = (await ipfs.cat(currentTextHash)).toString();
    const currentPrice = await contract.methods.currentPrice().call();

    this.setState({ currentText, currentPrice, loading: false });
  };

  bid = async (e) => {
    e.preventDefault();

    const { ipfs, accounts, contract, newText, newPrice } = this.state;

    this.setState({ loading: true });

    const [{ hash }] = await ipfs.add(new Buffer(newText));

    await contract.methods.bid(hash).send({
      from: accounts[0],
      value: newPrice
    });

    await this.load();
  };

  render() {
    const { currentPrice, currentText, newText, newPrice, web3, ipfs } = this.state;
    if (!(web3 && ipfs)) {
      return <div>Loading IPFS, Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>{currentText}</h1>
        <p>Current price: {currentPrice} wei</p>
        <form onSubmit={this.bid}>
          <input
            type="text"
            value={newText}
            onChange={event => this.setState({ newText: event.target.value })}
            placeholder="New text"
          />
          <input
            type="text"
            value={newPrice}
            onChange={event => this.setState({ newPrice: event.target.value })}
            placeholder="Price"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
