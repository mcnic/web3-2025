const getMessage = async (web3Client, contractAddress, abi) => {
  const contract = new web3Client.eth.Contract(abi, contractAddress);

  return await contract._methods.message().call();
};

module.exports = { getMessage };
