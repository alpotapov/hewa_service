const express = require("express");
const path = require("path");
const ethers = require("ethers");

const healthWalletAccessApi = require('./src/api/healthWalletAccess');

const PORT = process.env.PORT || 3011;

const app = express();
app.use(express.json({ extended: true }));
app.use('/data', express.static(path.join(__dirname, "public")));

app.use('/api/v1/access', healthWalletAccessApi);

// db.testConnection().then(() => db.sequelize.sync());
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
