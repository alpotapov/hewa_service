const ethers = require('ethers');
const config = require('config');
const fetch = require('node-fetch');
const { Web3Storage, File } = require('web3.storage');
// eslint-disable-next-line import/no-unresolved
const { pack } = require('ipfs-car/pack');
// eslint-disable-next-line import/no-unresolved
const { MemoryBlockStore } = require('ipfs-car/blockstore/memory');

const gasStationService = require('../services/gasStationService');
const artifacts = require('../contracts/hardhat_contracts.json');

const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const { RPC_URL } = process.env;
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const PRIVATE_KEY = process.env.PK_OPERATOR;
const { WEB3_STORAGE_TOKEN } = process.env;

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

const insertIntoRegistry = async ({
  deviceAddress, uuid, result, signature,
}) => {
  const { contract } = await getResultRegistryContract();
  const txParameters = {
    gasLimit: 120000,
    ...(await gasStationService.estimateGasPrice(CHAIN_ID)),
  };

  // Check that the UUID is not already in the registry

  try {
    const tx = await contract.publishResult(deviceAddress, uuid, result, signature, txParameters);
    return { transactionHash: tx.hash };
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    return { errorMessage };
  }
};

const uploadResultToIpfs = async (stringifiedResult) => {
  const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
  const buffer = Buffer.from(stringifiedResult);
  const files = [
    new File([buffer], 'result.json'),
  ];
  const cid = await client.put(files, { wrapWithDirectory: false });
  return cid;
};

const uploadResult = async ({
  deviceAddress, uuid, cid, signature, stringifiedResult,
}) => {
  const actualCid = await uploadResultToIpfs(stringifiedResult);

  if (actualCid !== cid) {
    return { errorMessage: 'CIDs not matching' };
  }

  const { transactionHash, errorMessage } = await insertIntoRegistry(
    {
      deviceAddress,
      uuid,
      result: actualCid,
      signature,
    },
  );

  return { transactionHash, errorMessage };
};

const toImportCandidate = (file) => {
  let stream;
  return {
    path: file.name,
    get content() {
      stream = stream || file.stream();
      return stream;
    },
  };
};

const calculateCid = async (stringifiedResult) => {
  const buffer = Buffer.from(stringifiedResult);
  const files = [
    new File([buffer], 'result.json'),
  ];
  const MAX_BLOCK_SIZE = 1048576;
  const blockstore = new MemoryBlockStore();
  try {
    const { root } = await pack({
      input: Array.from(files).map(toImportCandidate),
      blockstore,
      wrapWithDirectory: false,
      maxChunkSize: MAX_BLOCK_SIZE,
      maxChildrenPerNode: 1024,
    });
    return root.toString();
  } finally {
    await blockstore.close();
  }
};

const fetchResultFromIpfs = async (cid) => {
  if (!cid) return {};
  try {
    const url = `https://ipfs.io/ipfs/${cid}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS, status code: ${response.status}`);
    }
    const data = await response.buffer();
    return JSON.parse(data.toString());
  } catch (err) {
    console.error(err);
    return {};
  }
};

module.exports = {
  uploadResult,
  uploadResultToIpfs,
  calculateCid,
  fetchResultFromIpfs,
};
