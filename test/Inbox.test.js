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

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];
  console.log('defaultAccount:', defaultAccount);

  const block = await web3.eth.getBlockNumber();
  console.log('block:', block);

  const contract = new web3.eth.Contract(abi);

  const contractDeployer = contract.deploy({
    data: bytecode,
    arguments: ['Hi!'],
  });
  console.log('contract deployed');

  const gasPrice = await web3.eth.getGasPrice();
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
    gasPrice: web3.utils.numberToHex(gasPrice),
  });
  console.log('Contract deployed at address: ' + inbox.options.address);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    console.log({ inbox });
  });
});
