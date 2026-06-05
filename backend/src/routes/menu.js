const express = require('express');
const { getMenu } = require('../services/iikoClient');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
