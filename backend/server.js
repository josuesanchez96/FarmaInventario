const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const medicamentoRoutes = require('./src/routes/medicamentoRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging middleware for clean debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno en el servidor.'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor backend ejecutándose en el puerto ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🔑 Credenciales por defecto: admin / admin123`);
    console.log(`====================================================`);
  });
}

module.exports = app;

