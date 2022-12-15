const express = require('express');

const router = express.Router();

const contractDomain = require('../domain/contract');
const notificationDomain = require('../domain/notification');

router.get('/:guids', async (req, res) => {
  const { guids } = req.params;

  const guidsList = guids.split(';');
  const result = await Promise.all(
    guidsList.map(
      (guid) => contractDomain.triggerViewMethod('ResultRegistry', 'getResult', [guid]),
    ),
  );

  res.json(result);
});

router.post('/subscribe', async (req, res) => {
  const { guid, pushToken, resultRegistryAddress } = req.body;

  await notificationDomain.subscribe(guid, resultRegistryAddress, pushToken);

  res.status(200).send();
});

module.exports = router;
