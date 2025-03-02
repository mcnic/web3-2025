const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

// const web3 = new Web3(ganache.provider());
const web3 = new Web3('http://127.0.0.1:8545');

const output = require('../compile');
const { abi, evm } = output;
const bytecode = evm.bytecode.object;

let accounts;
let inbox;
let defaultAccount;
let gasPrice;
const initialMessage = 'Hi!';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  defaultAccount = accounts[0];
  console.log('defaultAccount:', defaultAccount);

  const block = await web3.eth.getBlockNumber();
  console.log('block:', block);

  const contract = new web3.eth.Contract(abi);

  const contractDeployer = contract.deploy({
    data: bytecode,
    arguments: [initialMessage],
  });
  console.log('contract deployed');

  gasPrice = await web3.eth.getGasPrice();
  // gasPrice =  web3.utils.numberToHex(gasPrice)
  console.log(
    'estimated gas price:',
    gasPrice,
    web3.utils.numberToHex(gasPrice)
  );

  const weiBalance = await web3.eth.getBalance(defaultAccount);
  const balance = web3.utils.fromWei(weiBalance, 'ether');
  console.log(`User balance: ${balance} ETH`);

  inbox = await contractDeployer.send({
    from: defaultAccount,
    gas: '1000000',
    gasPrice,
  });
  console.log('Contract deployed at address: ' + inbox.options.address);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    console.log({ inbox });
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const messaage = await inbox._methods.message().call();
    assert.equal(messaage, initialMessage);
  });

  it('set message', async () => {
    await inbox._methods.setMessage('new message').send({
      from: defaultAccount,
      gasPrice,
      gas: 1000000,
    });

    const messaage = await inbox._methods.message().call();
    assert.equal(messaage, 'new message');
  });
});
