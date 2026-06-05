const express = require('express');
const { createOrder } = require('../services/iikoClient');

const router = express.Router();

// Expected body: { tableId, items: [{ productId, quantity, modifiers? }] }
router.post('/', async (req, res, next) => {
  try {
    const { tableId, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required' });
    }

    const orderPayload = {
      tableIds: tableId ? [tableId] : [],
      items: items.map((i) => ({
        productId: i.productId,
        amount: i.quantity ?? 1,
        modifiers: i.modifiers || [],
      })),
    };

    let result;
    try {
      result = await createOrder(orderPayload);
    } catch (iikoErr) {
      // iiko недоступен — логируем, но не падаем (mock-режим)
      console.warn('iiko order failed (mock mode):', iikoErr.message);
      result = { order: { id: `mock-${Date.now()}` } };
    }
    res.json({ success: true, orderId: result.order?.id, result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
