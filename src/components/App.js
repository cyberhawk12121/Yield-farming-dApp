import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'

import DappToken from "../abis/DappToken.json"
import DaiToken from "../abis/DaiToken.json"

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()  
  }

  async loadBlockchainData(){
    const web3= window.web3
    const accounts= await web3.eth.getAccounts()
    console.log(accounts[0]);
    this.setState({account: accounts[0]});
    // Fetch Ganache network so that we can get the smart contract
    const netId= await web3.eth.net.getId()
    console.log(netId);

    // DaiToken
    const dai=DaiToken.networks[netId];  // fetch the address from abis
    if(dai){
      // We're getting the smart contract in JS
      const daiToken= new web3.eth.Contract(DaiToken.abi, dai.address)
      this.setState({daiToken: daiToken});
      // Then calling the methods
      let daiBalance=await daiToken.methods.balanceOf(this.state.account).call()
    }else{
      window.alert("Dai token smart contract not deployed to the connected network");
    }

  }

  // Connect to metamask/blockchain networks
  // ******** window.ethereum and ethereum.enable() is deprecated
  async loadWeb3(){
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
        this.setState({account: accounts[0]});
      } catch (error) {
        if (error.code === 4001) {
          window.alert("Couldn't find any accounts to connect");
        }
        console.log(error);
      }
    }
    else{
      alert("Install metamask!");
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '<address>',
      tokenBank :{},
      dappToken: {},
      daiToken: {},
      daiBalance:'0',
      dappBalance:'0',
      depositedBalance:'0',
      loading:true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;