const express = require('express');
const ethers = require("ethers");
const config = require('config');
const router = express.Router();

const artifacts = require('../contracts/hardhat_contracts.json');
const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const RPC_URL = config.get('rpcUrl');
const { HealthWalletAccess } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
// const privateKey = process.env.HWA_OWNER_PRIVATE_KEY;
// const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY;

router.post('/', async (req, res) => {
  const { patientAddress, signedRequest, nonce } = req.body;
  const { abi: hwaABI, address: hwaAddress } = HealthWalletAccess;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(hwaAddress, hwaABI, provider.getSigner());

  try {
    const tx = await contract.requestNewAccessToken(
      patientAddress, nonce, signedRequest, false
    );
    const result = await tx.wait();
    const event = result.events.find((event) => event.event === 'Transfer');
    console.log({ event });
    return res.json({
      transactionHash: event?.transactionHash
    });
  } catch (err) {
    console.error(err);
  }

  res.status(400).send();
});

module.exports = router;