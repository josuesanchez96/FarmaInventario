const express = require('express');
const cors = require('cors');

const authRoutes = require('../backend/src/routes/authRoutes');
const medicamentoRoutes = require('../backend/src/routes/medicamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Sistema de Inventario de Medicamentos API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);

// Fallbacks without /api prefix
app.use('/auth', authRoutes);
app.use('/medicamentos', medicamentoRoutes);

// Catch all for unmatched API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta API no encontrada: ${req.method} ${req.url}`
  });
});

module.exports = app;
