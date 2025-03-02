const { urls, getClientFromMnemonic, getBalance } = require('./utils');
const output = require('./compile');

const endpointUrl = urls.sopolia;
const mnemonic = process.env.MNENONIC;
let walletAddress = '0x87FACa430E7DE6d1DDEb16d2e49D1dF2fA80b838';

const deploy = async () => {
  const { web3, provider } = getClientFromMnemonic(mnemonic, endpointUrl);
  const accounts = await web3.eth.getAccounts();
  walletAddress = accounts[0];
  console.log({ walletAddress });

  const block = await web3.eth.getBlockNumber();
  console.log({ block });

  const { balanceEther: balanceBefore } = await getBalance(web3, walletAddress);

  const { abi, evm } = output;
  const bytecode = evm.bytecode.object;
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: walletAddress });
  console.log('Contract deployed to', result.options.address);

  const { balanceEther: balanceAfter_ } = await getBalance(web3, walletAddress);
  console.log({ balanceBefore, balanceAfter_ });

  provider.engine.stop();
};

deploy();
