const express = require('express');
const ethers = require('ethers');
const basicAuth = require('express-basic-auth');
const config = require('config');

const router = express.Router();

const gasStationService = require('../services/gasStationService');
const resultRegistryDomain = require('../domain/resultRegistry');
const notificationDomain = require('../domain/notification');
const artifacts = require('../contracts/hardhat_contracts.json');

const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const { RPC_URL } = process.env;
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const PRIVATE_KEY = process.env.PK_OPERATOR;

const auth = basicAuth({
  users: {
    dx365admin: 'bloodtestsforall',
  },
});

const extractErrorMessage = (err) => {
  try {
    return JSON.parse(err.body).error.message;
  } catch (e) {
    return err.reason;
  }
};

const getResultRegistryContract = async () => {
  const { abi, address } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const connectedWallet = wallet.connect(provider);
  const contract = new ethers.Contract(address, abi, connectedWallet);

  return { contract };
};

router.post('/', auth, async (req, res) => {
  const { deviceAddress } = req.body;
  console.log('Authorizing new device', deviceAddress);

  const { contract } = await getResultRegistryContract();
  const txParameters = {
    gasLimit: 50000,
    ...(await gasStationService.estimateGasPrice(CHAIN_ID)),
  };
  try {
    const tx = await contract.authorizeDevice(deviceAddress, txParameters);
    console.log('Submitted transaction to authorize device', tx.hash);
    res.json({ transactionHash: tx.hash });
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    console.error('Failed to authorize device', { deviceAddress, errorMessage });
    res.status(400).json({ errorMessage }).send();
  }
});

router.post('/upload-result', async (req, res) => {
  const {
    guid, deviceAddress, result, signature,
  } = req.body;
  console.log('Uploading new result', deviceAddress);

  const { transactionHash, errorMessage } = await resultRegistryDomain.uploadResult(
    deviceAddress,
    guid,
    result,
    signature,
  );

  if (errorMessage) {
    console.error('Failed to upload result', errorMessage);
    res.status(400).json({ errorMessage }).send();
    return;
  }
  console.log('Submitted transaction to upload result', { transactionHash, guid });

  await notificationDomain.transactionSent(guid, transactionHash);

  res.json(transactionHash);
});

module.exports = router;
