const express = require('express');
const path = require('path');
const config = require('config');
const cors = require('cors');

const deviceApi = require('./src/api/device');
const resultApi = require('./src/api/result');

const PORT = process.env.PORT || 3011;
const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log(`${Date.now()} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
});
app.use(express.json({ extended: true }));
app.use('/data', express.static(path.join(__dirname, 'public')));

app.use('/api/v1/device', deviceApi);
app.use('/api/v1/result', resultApi);

// db.testConnection().then(() => db.sequelize.sync());
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`Network: ${CHAIN_ID} - ${CHAIN_NAME}`);
});
