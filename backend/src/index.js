require('dotenv').config();
const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menu');
const scenariosRoutes = require('./routes/scenarios');
const orderRoutes = require('./routes/order');
const stoplistRoutes = require('./routes/stoplist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/scenarios', scenariosRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/stoplist', stoplistRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Smart Order backend running on port ${PORT}`);
});
