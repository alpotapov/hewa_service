const ethers = require('ethers');
const fetch = require('node-fetch');

const estimateGasPrice = async (chainId) => {
  if (chainId !== '137') {
    return {};
  }
  const response = await fetch('https://gasstation-mainnet.matic.network/v2');
  const data = await response.json();
  const maxFeePerGas = ethers.utils.parseUnits(
    `${Math.ceil(data.fast.maxFee)}`,
    'gwei',
  );
  const maxPriorityFeePerGas = ethers.utils.parseUnits(
    `${Math.ceil(data.fast.maxPriorityFee)}`,
    'gwei',
  );

  return {
    maxPriorityFeePerGas, maxFeePerGas,
  };
};

module.exports = {
  estimateGasPrice,
};
