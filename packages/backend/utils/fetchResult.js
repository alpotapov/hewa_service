const ethers = require('ethers');

const artifacts = require('../src/contracts/hardhat_contracts.json');
const CHAIN_ID = "31337";
const CHAIN_NAME = "localhost";
const RPC_URL = "http://localhost:8545";
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;

const fetchResult = async (guid) => {
  const { abi, address } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  const result = await contract.getResult(guid);

  return result;
}

export default {
  fetchResult
}