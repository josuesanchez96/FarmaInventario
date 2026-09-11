const express = require('express');
const cors = require('cors');

const authRoutes = require('../backend/src/routes/authRoutes');
const medicamentoRoutes = require('../backend/src/routes/medicamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Normalization middleware for Vercel Serverless Function rewrites
app.use((req, res, next) => {
  // Normalize /api/auth/login -> /auth/login if /api prefix is present
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api', '');
  } else if (req.url === '/api' || req.url === '/api/') {
    req.url = '/';
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Sistema de Inventario de Medicamentos API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/medicamentos', medicamentoRoutes);

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta API no encontrada: ${req.method} ${req.url}`
  });
});

module.exports = app;
