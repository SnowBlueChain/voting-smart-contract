import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Election from '../abis/Election.json'
import Main from './Main'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      accountBalance: 0,
      candidatesCount: 0,
      candidates: [],
      adminAccount: '',
      allAcounts: [],
      votedAccounts: [],
      loading: true,
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.getAllAccounts()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async getAllAccounts() {
    var Web3 = require('web3');
    let web3 = new Web3('HTTP://127.0.0.1:7545')
    const accounts = await web3.eth.getAccounts()
    this.setState({ allAcounts: accounts })
    this.setState({ adminAccount: accounts[9] })
  }


  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    let accountBalance = await web3.eth.getBalance(accounts[0]);
    console.log(accountBalance)
    accountBalance = web3.utils.fromWei(accountBalance, 'ether')
    console.log(accountBalance)
    this.setState({ accountBalance })

    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    const networkData = Election.networks[networkId]
    console.log(networkData.address)
    console.log(Election.abi)

    if (networkData) {
      const election = web3.eth.Contract(Election.abi, networkData.address)
      this.setState({ election })

      const candidatesCount = await election.methods.candidatesCount().call()
      this.setState({ candidatesCount })
      console.log(this.state.candidatesCount)

      // Load candidates
      for (var i = 1; i <= candidatesCount; i++) {
        const candidate = await election.methods.candidates(i).call()
        this.setState({ candidates: [...this.state.candidates, candidate] })
      }

      // Load voted accounts
      this.state.allAcounts.forEach(async (account) => {
        if (await election.methods.voters(account).call() == true) {
          this.setState({ votedAccounts: [...this.state.votedAccounts, account] })
          console.log(this.state.votedAccounts)
        }
      })

      this.setState({ loading: false })
    } else {
      window.alert('Election contract not deployed to detected network.')
    }
  }

  addCandidate = (candidateName, partyName) => {
    this.setState({ loading: true })
    this.state.election.methods.addCandidate(candidateName, partyName, this.state.adminAccount).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  vote = (id) => {
    console.log(id)
    this.setState({ loading: true })
    this.state.election.methods.vote(id).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div className=''>
        {
          this.state.loading
            ?
            <div id="loader" className="text-center"><h2 className="text-center mt-5"><i>Loading...</i></h2></div>
            :
            <Main
              candidates={this.state.candidates}
              account={this.state.account}
              accountBalance={this.state.accountBalance}
              adminAccount={this.state.adminAccount}
              votedAccounts={this.state.votedAccounts}
              allAccounts={this.state.allAcounts}
              addCandidate={this.addCandidate}
              vote={this.vote} />
        }
      </div>

    );
  }
}

export default App;