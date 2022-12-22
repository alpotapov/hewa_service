const ethers = require('ethers');

const { RPC_URL } = process.env;

const isMined = async (transactionHash) => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
  return !!(transactionReceipt && transactionReceipt.blockNumber);
};

module.exports = {
  isMined,
};
