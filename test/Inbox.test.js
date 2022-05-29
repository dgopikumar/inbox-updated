const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, evm} = require('../compile');

let accounts;
let inbox;
const InitialString = 'Hi there!';
beforeEach( async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(abi).deploy({data:evm.bytecode.object, arguments:[InitialString]})
  .send({from:accounts[0], gas:'1000000'});
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('Default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, InitialString);
  });

  it('Change message', async () => {
    await inbox.methods.setMessage('bye').send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message,'bye');
  })
});
