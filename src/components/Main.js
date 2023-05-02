import React, { Component } from 'react';
import EthLogo from './ethereum-eth-logo.png';
import Swal from 'sweetalert2';
import './App.css';


class Main extends Component {

  constructor() {
    super();
    this.state = {
    }
  }

  formSubmit = (event) => {
    event.preventDefault()
    const candidateName = this.candidateName.value
    const partyName = this.partyName.value
    this.props.addCandidate(candidateName, partyName)
  }

  castVote = (event) => {
    this.props.votedAccounts.map((account) => {
      if (this.props.account === account) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You cannot vote twice',
          showConfirmButton: false,
          timer: 1500
        })
        return
      }
    })
    this.props.vote(event.target.name)
  }

  render() {
    return (
      <div id="content" className='p-3'>

        {
          this.props.account !== this.props.adminAccount
            ?
            <div class="mt-2 mb-2 ml-5">
              <img src={EthLogo} alt="" srcset="" width="200px" class="float-right mr-5"></img>
              <h4 class="display-1 main-heading">Hello, Voter!</h4>
              <h4><i>Be part of the Election and cast your vote the decentralized way. Unlock the power of Ethereum.</i></h4>
            </div>
            :
            <div class="mt-2 mb-2 ml-5">
              <img src={EthLogo} alt="" srcset="" width="300px" class="float-right mr-5"></img>
              <h4 class="display-1 main-heading">Hello, admin!</h4>
              <h3>Add candidate details here :</h3>
            </div>
        }

        {
          this.props.account === this.props.adminAccount
            ?
            <div className='mb-2 ml-5'>
              <form>
                <div className="form-group mt-3 input-form-width">
                  <input
                    id="candidateName"
                    type="text"
                    ref={(input) => { this.candidateName = input }}
                    className="form-control form-width"
                    placeholder="Candidate Name"
                    required />
                </div>
                <div className="form-group input-form-width">
                  <input
                    id="partyName"
                    type="text"
                    ref={(input) => { this.partyName = input }}
                    className="form-control form-width"
                    placeholder="Party Name"
                    required />
                </div>
              </form>
              <button type="submit" className="btn btn-dark mt-2 mb-2" onClick={this.formSubmit}>Add Candidate</button>
            </div>
            :
            null
        }

        <div className='d-flex big-margin'>
          <div className='flexed-1 ml-5'>
            <div className='sub-heading'>
              <h1>Elegible Voter Accounts</h1>
            </div>
            <hr></hr>
            {this.props.allAccounts.map((account, key) => {
              return (
                <div>
                  <div className='shadow-lg p-2'>
                    <h5><i>{account}</i></h5>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='flexed-2'>
            <div className='sub-heading'>
              <h1>Candidates List</h1>
            </div>
            <hr></hr>
            {this.props.candidates.map((candidate, key) => {
              console.log(candidate.id)
              return (
                <div>
                  <div className='candidate-card text-justify shadow-lg'>
                    <h3><b>{candidate.name}</b></h3>
                    <h4>{candidate.partyName} party</h4>
                    <h4>{candidate.voteCount.toString()} votes</h4>
                    <button className='btn btn-dark btn-block' type="submit" name={candidate.id} onClick={this.castVote}>Vote</button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='flexed-3'>
            <div className='sub-heading'>
              <h1>Voted Accounts</h1>
            </div>
            <hr></hr>
            {this.props.votedAccounts.map((account, key) => {
              return (
                <div>
                  <div className='shadow-lg p-2'>
                    <h5><i>{account}</i></h5>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {
          this.props.account !== this.props.adminAccount
            ?
            <div className='container footer-style text-center'>
              <h2>Logged In Account : {this.props.account}</h2>
            </div>
            :
            null
        }

      </div>
    );
  }
}

export default Main;