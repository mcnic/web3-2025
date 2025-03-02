const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');

const urls = {
  sopolia:
    'https://eth-sepolia.g.alchemy.com/v2/WddzdzI2o9S3COdT73d5w6AIogbKq4X-',
};
const getClient = (endpointUrl) => {
  const provider = new Web3.providers.HttpProvider(endpointUrl);
  // const provider = new Web3(endpointUrl);
  return { provider, web3: new Web3(provider) };
};

const getClientFromMnemonic = (mnemonic, endpointUrl) => {
  const provider = new HDWalletProvider(mnemonic, endpointUrl);
  return { provider, web3: new Web3(provider) };
};

const getBalance = async (web3Client, walletAddress) => {
  const balanceWei = await web3Client.eth.getBalance(walletAddress); //await contract.methods.balanceOf(walletAddress).call();
  const balanceEther = web3Client.utils.fromWei(balanceWei, 'ether');
  return { balanceWei, balanceEther };
};

module.exports = { urls, getClient, getClientFromMnemonic, getBalance };
