const express = require('express');
const ethers = require("ethers");
const basicAuth = require('express-basic-auth');
const config = require("config");
const router = express.Router();


const artifacts = require('../contracts/hardhat_contracts.json');
const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const RPC_URL = process.env.RPC_URL;
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const PRIVATE_KEY = process.env.PK_OPERATOR;

const auth = basicAuth({
  users: {
    'admin': 'phyle',
  }
});

const getResultRegistryContract = async () => {
  const { abi, address } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const connectedWallet = wallet.connect(provider);
  const contract = new ethers.Contract(address, abi, connectedWallet);

  return { contract };
}

router.post('/', auth, async (req, res) => {
  const { deviceAddress } = req.body;
  const { contract } = await getResultRegistryContract();

  try {
    const tx = await contract.authorizeDevice(
      deviceAddress
    );
    const result = await tx.wait();
    const event = result.events.find((event) => event.event === 'DeviceAuthorized');
    if (event) {
      console.log('Successfuly authorized new device', { deviceAddress, event });
      res.status(201).send();
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error('Failed to authorize device', { deviceAddress, err });
    res.status(400).send();
  }
});

router.post('/upload-result', async (req, res) => {
  const { guid, deviceAddress, result, signature } = req.body;
  
  const { contract } = await getResultRegistryContract();

  try {
    const tx = await contract.publishResult(
      deviceAddress, guid, result, signature
    );
    const txResult = await tx.wait();
    console.log({ txResult });

    res.status(201).send();
  } catch(err) {
    console.error('Failed to upload result', { err });
    res.status(400).send();
  }
})

module.exports = router;
