const { urls, getClientFromMnemonic, getBalance } = require('./utils');
const output = require('./compile');
const { getMessage } = require('./inbox.methods');

const { abi, evm } = output;
const endpointUrl = urls.sopolia;
const mnemonic = process.env.MNENONIC;
let walletAddress = '0x87FACa430E7DE6d1DDEb16d2e49D1dF2fA80b838';
const { web3, provider } = getClientFromMnemonic(mnemonic, endpointUrl);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  walletAddress = accounts[0];
  console.log({ walletAddress });

  const block = await web3.eth.getBlockNumber();
  console.log({ block });

  const { balanceEther: balanceBefore } = await getBalance(web3, walletAddress);

  const bytecode = evm.bytecode.object;
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: walletAddress });

  const { balanceEther: balanceAfter_ } = await getBalance(web3, walletAddress);
  console.log({ balanceBefore, balanceAfter_ });

  return result.options.address;
};

deploy().then((contractAddress) => {
  console.log('Contract deployed to', contractAddress);

  provider.engine.stop();
});

// const contractAddress = '0x38CC8277225FBF6c4b8bf892a32E081d7F06F1ca'; // 'Hi there!'
// const contractAddress = '0x33798aFeB7fFaB0FDed52e881F5FdCfDD30F195C'; // 'Hi there whu!'
// getMessage(web3, contractAddress, abi).then((messaage) => {
//   console.log({ messaage });

//   provider.engine.stop();
// });
