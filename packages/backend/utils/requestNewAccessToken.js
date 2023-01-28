const ethers = require('ethers');

const CHAIN_ID = '31337';
const CHAIN_NAME = 'localhost';
const artifacts = require('../src/contracts/hardhat_contracts.json');

const { HealthWalletAccess } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const rpcUrl = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const { abi: hwaABI, address: hwaAddress } = HealthWalletAccess;

const go = async (pk) => {
  const contract = new ethers.Contract(hwaAddress, hwaABI, provider);
  const hash = await contract.getMessageHash('Create HealthWalletAccess token', 1);

  const wallet = new ethers.Wallet(pk);

  const signed = await wallet.signMessage(ethers.utils.arrayify(hash));

  return signed;
};

module.exports = {
  go,
};
