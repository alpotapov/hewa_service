const express = require('express');
const path = require('path');
const config = require('config');
const cors = require('cors');
const db = require('./db');

const deviceApi = require('./src/api/device');
const resultApi = require('./src/api/result');
const healthcheckApi = require('./src/api/healthcheck');
const demoApi = require('./src/api/demo');

const transactionWatcher = require('./src/jobs/transactionWatcher');

const requestLogger = require('./src/middleware/requestLogger');

const PORT = process.env.PORT || 3011;
const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.json({ extended: true }));
app.use('/data', express.static(path.join(__dirname, 'public')));
app.use('/demo', express.static(path.join(__dirname, 'demo-app-dist')));
app.use('/static', express.static(path.join(__dirname, 'demo-app-dist', 'static')));

app.use('/api/v1/device', deviceApi);
app.use('/api/v1/result', resultApi);
app.use('/api/v1/healthcheck', healthcheckApi);
app.use('/api/v1/demo', demoApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-app-dist', 'index.html'));
});

db.testConnection()
  .then(() => db.sequelize.sync())
  .then(() => transactionWatcher.run())
  .then(
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
      console.log(`Network: ${CHAIN_ID} - ${CHAIN_NAME}`);
    }),
  );
