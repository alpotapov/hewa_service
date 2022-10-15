const express = require('express');
const ethers = require("ethers");
const basicAuth = require('express-basic-auth');
const config = require("config");
const router = express.Router();


const artifacts = require('../contracts/hardhat_contracts.json');
const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const RPC_URL = config.get('rpcUrl');
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;

const auth = basicAuth({
  users: {
    'admin': 'phyle',
  }
});

router.post('/', auth, async (req, res) => {
  const { deviceAddress } = req.body;
  const { abi, address  } = ResultRegistry;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(address, abi, provider.getSigner());

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

module.exports = router;
