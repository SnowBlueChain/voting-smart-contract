pragma solidity ^0.5.0;

contract Election {

  uint public candidatesCount;

  mapping(address => bool) public voters;
  mapping(uint => Candidate) public candidates;

  struct Candidate {
      uint id;
      string name;
      string partyName;
      uint voteCount;
  }

  event candidateAdded(uint id, string name, string partyName, uint voteCount);
  event votedEvent(uint id, string name, string partyName, uint voteCount);

  function addCandidate(string memory _name, string memory _party, address  _admin) public {
      require(bytes(_name).length > 0, '');
      require(bytes(_party).length > 0, '');
      require(msg.sender == _admin, 'only admin account can add the candidates');
      candidatesCount ++;
      candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
      emit candidateAdded(candidatesCount, _name, _party, 0);
  }

  function vote(uint _candidateId) public {
      require(!voters[msg.sender], "you have already casted your vote");
      require(_candidateId > 0 && _candidateId <= candidatesCount, "candidate is not valid");
      voters[msg.sender] = true;
      Candidate memory _candidate = candidates[_candidateId];
      _candidate.voteCount = _candidate.voteCount + 1;
      candidates[_candidateId] = _candidate;
      emit votedEvent(_candidateId, _candidate.name, _candidate.partyName,_candidate.voteCount);
  }
}