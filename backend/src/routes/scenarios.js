const express = require('express');
const path = require('path');
const fs = require('fs');
const { getMenu, getStopList } = require('../services/iikoClient');

const router = express.Router();

function loadScenarios() {
  const p = path.join(__dirname, '..', '..', '..', 'config', 'scenarios.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// GET /api/scenarios?type=fast|profitable|popular|group
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    const scenarios = loadScenarios();
    const menu = await getMenu();
    const stopList = await getStopList();

    const itemsMap = Object.fromEntries(menu.items.map((i) => [i.id, i]));

    let result = scenarios;

    if (type) {
      const scenario = scenarios.find((s) => s.type === type);
      if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

      const combos = buildCombos(scenario, itemsMap, stopList);
      return res.json({ scenario: scenario.type, combos });
    }

    // Return all scenarios with combo preview
    result = scenarios.map((s) => ({
      type: s.type,
      label: s.label,
      icon: s.icon,
      combos: buildCombos(s, itemsMap, stopList),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

function buildCombos(scenario, itemsMap, stopList) {
  return scenario.combos
    .map((combo) => {
      const resolvedItems = combo.itemIds
        .map((id) => itemsMap[id])
        .filter(Boolean)
        .filter((item) => !stopList.includes(item.id));

      if (resolvedItems.length === 0) return null;

      const totalPrice = resolvedItems.reduce((sum, i) => sum + i.price, 0);
      const maxCookingTime = Math.max(...resolvedItems.map((i) => i.cookingTime ?? 0));

      return {
        id: combo.id,
        name: combo.name,
        items: resolvedItems,
        totalPrice,
        maxCookingTime,
        imageUrl: combo.imageUrl || resolvedItems[0]?.imageUrl || null,
      };
    })
    .filter(Boolean);
}

module.exports = router;
