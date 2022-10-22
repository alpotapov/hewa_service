const express = require('express');

const router = express.Router();

const contractDomain = require('../domain/contract');

router.get('/:guid', async (req, res) => {
  const { guid } = req.params;

  const result = await contractDomain.triggerViewMethod('ResultRegistry', 'getResult', [guid]);

  res.json(result);
});

module.exports = router;
