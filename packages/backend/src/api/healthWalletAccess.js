const express = require('express');
const ethers = require("ethers");
const router = express.Router();

const artifacts = require('../contracts/hardhat_contracts.json');
const CHAIN_ID = "31337";
const CHAIN_NAME = "localhost";
const { HealthWalletAccess } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
// const privateKey = process.env.HWA_OWNER_PRIVATE_KEY;
// const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY;
const rpcUrl = 'http://localhost:8545';

router.post('/', async (req, res) => {
  const { patientAddress, signedRequest, nonce } = req.body;
  const { abi: hwaABI, address: hwaAddress } = HealthWalletAccess;

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
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