const express = require('express');

const router = express.Router();

const contractDomain = require('../domain/contract');

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

module.exports = router;
