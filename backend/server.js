const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const menuRoutes  = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();

// ── SECURITY MIDDLEWARE ──
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ── RATE LIMITING ──
const limiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 minutes
  max      : 100,             // max 100 requests per 15 min
  message  : { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── ROUTES ──
app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ status: 'Pizza Valley API is running 🍕', version: '1.0.0' });
});

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));