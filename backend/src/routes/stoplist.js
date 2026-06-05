const express = require('express');
const { getStopList } = require('../services/iikoClient');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const ids = await getStopList();
    res.json({ stoppedIds: ids });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
