const express = require('express');
const demoDomain = require('../domain/demoDomain');

const router = express.Router();

router.post('/', async (req, res) => {
  const { uuid, testValue } = req.body;
  const fhirRecord = await demoDomain.getDemoFhirRecord(uuid, testValue);
  const { transactionHash, errorMessage } = await demoDomain.uploadResult(uuid, fhirRecord);

  if (errorMessage) {
    res.status(400).json({ errorMessage });
    return;
  }

  res.json({ transactionHash });
});

module.exports = router;
