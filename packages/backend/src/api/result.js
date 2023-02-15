const express = require('express');

const router = express.Router();

const contractDomain = require('../domain/contract');
const notificationDomain = require('../domain/notification');
const resultRegistryDomain = require('../domain/resultRegistry');

router.get('/:guids', async (req, res) => {
  const { guids } = req.params;

  const guidsList = guids.split(';');
  const result = await Promise.all(
    guidsList.map(
      (guid) => contractDomain.triggerViewMethod('ResultRegistry', 'getResult', [guid]),
    ),
  );

  const records = await Promise.all(
    result.map((cid) => resultRegistryDomain.fetchResultFromIpfs(cid)),
  );

  res.json(records);
});

router.post('/subscribe', async (req, res) => {
  const { guid, pushToken } = req.body;

  try {
    await notificationDomain.subscribe(guid, pushToken);
  } catch (err) {
    console.error(`Failed to subscribe for notifications about ${guid}`, err);
    res.status(500).json({ errorMessage: err.message }).send();
  }

  res.status(200).send();
});

module.exports = router;
