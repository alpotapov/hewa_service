const ethers = require('ethers');
const config = require('config');

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

const contracts = {
  ResultRegistry: getResultRegistryContract,
};

const extractErrorMessage = (err) => {
  console.log({ err });
  try {
    return JSON.parse(err.body).error.message;
  } catch (e) {
    return err.reason;
  }
};

const triggerViewMethod = async (contractName, methodName, args) => {
  const { contract } = await contracts[contractName]();
  try {
    const result = await contract[methodName](...args);
    return result;
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    console.error(errorMessage);
    throw Error(errorMessage);
  }
};

const triggerMethod = async (contractName, methodName, args) => {
  const contract = contracts[contractName]();
  try {
    const tx = await contract[methodName](args);
    console.log('Transaction submitted', tx.hash);
    return tx.hash;
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    throw new Error(errorMessage);
  }
};

module.exports = {
  triggerViewMethod,
  triggerMethod,
};
