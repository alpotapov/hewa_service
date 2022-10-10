const express = require("express");
const path = require("path");
const ethers = require("ethers");

const artifacts = require('./src/contracts/hardhat_contracts.json');

const CHAIN_ID = "31337";
const CHAIN_NAME = "localhost";
const { HealthWalletAccess } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const PORT = process.env.PORT || 3011;
// const privateKey = process.env.HWA_OWNER_PRIVATE_KEY;
// const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY;
const rpcUrl = 'http://localhost:8545';

const app = express();

app.use(express.json({ extended: true }));
app.use('/data', express.static(path.join(__dirname, "public")));

app.post('/api/access', async (req, res) => {
  const { patientAddress, signedRequest, nonce } = req.body;
  const { abi: hwaABI, address: hwaAddress } = HealthWalletAccess;

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(hwaAddress, hwaABI, provider.getSigner());

  try {
    const result = await contract.requestNewAccessToken(
      patientAddress, nonce, signedRequest, false
    );
    console.log({ result });
    return res.json(result);
  } catch (err) {
    console.error(err);
  }

  res.status(400).send();
});

// db.testConnection().then(() => db.sequelize.sync());
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
