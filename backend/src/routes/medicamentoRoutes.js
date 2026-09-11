const express = require('express');
const router = express.Router();
const MedicamentoController = require('../controllers/medicamentoController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateMedicamento } = require('../middlewares/validationMiddleware');

// All medication routes are protected by JWT authentication
router.use(authenticateToken);

router.get('/dashboard', MedicamentoController.getDashboard);
router.get('/', MedicamentoController.getAll);
router.get('/:id', MedicamentoController.getById);
router.post('/', validateMedicamento, MedicamentoController.create);
router.put('/:id', validateMedicamento, MedicamentoController.update);
router.delete('/:id', MedicamentoController.delete);

module.exports = router;
