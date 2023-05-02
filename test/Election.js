const Election = artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', ([deployer, admin, voter]) => {
  let election

  before(async () => {
    election = await Election.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await election.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('Add Candidates', async () => {
    let result, candidatesCount
    it('adds participating candidates', async () => {
      result = await election.addCandidate('Obama', 'Democratic', admin, { from: admin })
      candidatesCount = await election.candidatesCount()
      const event = result.logs[0].args
      assert.equal(candidatesCount, 1)
      assert.equal(event.id, 1)
      assert.equal(event.name, 'Obama')
      assert.equal(event.voteCount, 0)
    })
  })

  describe('Vote!', async () => {
    let result, candidatesCount
    it('can vote a candidate', async () => {
      result = await election.addCandidate('Trump', 'Republic', admin, { from: admin })
      candidatesCount = await election.candidatesCount()
      result = await election.addCandidate('Clint', 'Democratic', admin, { from: admin })
      candidatesCount = await election.candidatesCount()
      result = await election.vote(2)
      candidatesCount = await election.candidatesCount()
      const event = result.logs[0].args
      assert.equal(candidatesCount, 3)
      assert.equal(event.id, 2)
      assert.equal(event.voteCount, 1)
      assert.equal(event.name, 'Trump')
      assert.equal(event.partyName, 'Republic')
    })
  })

})