const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/', async (req, res) => {
  // const { guid, result } = req.body;
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).send();
});

module.exports = router;
