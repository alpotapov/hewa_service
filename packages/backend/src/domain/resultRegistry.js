const ethers = require('ethers');
const config = require('config');

const gasStationService = require('../services/gasStationService');
const artifacts = require('../contracts/hardhat_contracts.json');

const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const { RPC_URL } = process.env;
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const PRIVATE_KEY = process.env.PK_OPERATOR;

const getResultRegistryContract = async () => {
  const { abi, address } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const connectedWallet = wallet.connect(provider);
  const contract = new ethers.Contract(address, abi, connectedWallet);

  return { contract };
};

const extractErrorMessage = (err) => {
  try {
    return JSON.parse(err.body).error.message;
  } catch (e) {
    return err.reason;
  }
};

const uploadResult = async (deviceAddress, guid, result, signature) => {
  const { contract } = await getResultRegistryContract();
  const txParameters = {
    gasLimit: 60000,
    ...(await gasStationService.estimateGasPrice(CHAIN_ID)),
  };

  try {
    const tx = await contract.publishResult(deviceAddress, guid, result, signature, txParameters);
    return { transactionHash: tx.hash };
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    return { errorMessage };
  }
};

module.exports = {
  uploadResult,
};
