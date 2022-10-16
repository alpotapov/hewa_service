
const ethers = require('ethers');

const artifacts = require('../src/contracts/hardhat_contracts.json');
const CHAIN_ID = "31337";
const CHAIN_NAME = "localhost";
const RPC_URL = "http://localhost:8545";
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;

const go = async (pk, result, guid) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${result}${guid}`)
  );
  
  const wallet = new ethers.Wallet(pk);

  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return {
    deviceAddress: wallet.address,
    signature,
  };
}

const fetchResult = async (guid) => {
  const { abi, address } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  const result = await contract.getResult(guid);

  return result;
}

module.exports = {
  go, fetchResult
}
