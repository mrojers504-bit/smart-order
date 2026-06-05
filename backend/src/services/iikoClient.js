const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
const fs = require('fs');

const cache = new NodeCache({ stdTTL: Number(process.env.MENU_CACHE_TTL) || 300 });

const BASE_URL = process.env.IIKO_API_URL || 'https://api-ru.iiko.services/api/1';
const ORG_ID = process.env.IIKO_ORGANIZATION_ID;

let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const res = await axios.post(`${BASE_URL}/access_token`, {
    apiLogin: process.env.IIKO_LOGIN,
    apiPassword: process.env.IIKO_PASSWORD,
  });
  tokenCache = {
    token: res.data.token,
    // iiko tokens live 60 min; refresh at 55 min
    expiresAt: Date.now() + 55 * 60 * 1000,
  };
  return tokenCache.token;
}

function loadMock(name) {
  const mockPath = path.join(__dirname, '..', '..', '..', 'mock', `${name}.json`);
  return JSON.parse(fs.readFileSync(mockPath, 'utf8'));
}

async function apiGet(endpoint, body) {
  const token = await getToken();
  const res = await axios.post(`${BASE_URL}/${endpoint}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function getMenu() {
  const cached = cache.get('menu');
  if (cached) return cached;

  let menu;
  try {
    const data = await apiGet('nomenclature', { organizationId: ORG_ID });
    menu = normalizeMenu(data);
  } catch (err) {
    console.warn('iiko unavailable, using mock menu:', err.message);
    menu = loadMock('menu');
  }

  cache.set('menu', menu);
  return menu;
}

function normalizeMenu(raw) {
  const categories = (raw.groups || []).map((g) => ({
    id: g.id,
    name: g.name,
    parentId: g.parentGroup,
  }));

  const items = (raw.products || [])
    .filter((p) => p.type === 'Dish' || p.type === 'Good')
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.sizePrices?.[0]?.price?.currentPrice ?? 0,
      categoryId: p.parentGroup,
      imageUrl: p.imageLinks?.[0] || null,
      cookingTime: p.additionalInfo ? parseCookingTime(p.additionalInfo) : null,
      weight: p.weight || null,
      energyFullAmount: p.energyFullAmount || null,
    }));

  return { categories, items };
}

function parseCookingTime(info) {
  const match = String(info).match(/(\d+)\s*(мин|min)/i);
  return match ? Number(match[1]) : null;
}

async function getStopList() {
  try {
    const data = await apiGet('stop_lists', { organizationIds: [ORG_ID] });
    const items = data.terminalGroupsStopLists?.[0]?.stopList?.items || [];
    return items.map((i) => i.productId);
  } catch (err) {
    console.warn('iiko stoplist unavailable:', err.message);
    return [];
  }
}

async function createOrder(orderPayload) {
  const token = await getToken();
  const res = await axios.post(
    `${BASE_URL}/deliveries:create`,
    {
      organizationId: ORG_ID,
      order: orderPayload,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

module.exports = { getMenu, getStopList, createOrder };
