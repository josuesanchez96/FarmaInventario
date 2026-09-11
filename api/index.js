const express = require('express');
const cors = require('cors');

const authRoutes = require('../backend/src/routes/authRoutes');
const medicamentoRoutes = require('../backend/src/routes/medicamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Robust URL Normalization for Vercel Serverless Rewrites
app.use((req, res, next) => {
  const rawUrl = req.originalUrl || req.url || '';
  
  if (rawUrl.includes('/auth')) {
    req.url = rawUrl.substring(rawUrl.indexOf('/auth'));
  } else if (rawUrl.includes('/medicamentos')) {
    req.url = rawUrl.substring(rawUrl.indexOf('/medicamentos'));
  } else if (rawUrl.includes('/health')) {
    req.url = '/health';
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

// Catch-all 404 Handler for API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta API no encontrada: ${req.method} ${req.url}`
  });
});

module.exports = app;
