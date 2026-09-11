const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/login', AuthController.login);
router.get('/me', authenticateToken, AuthController.getMe);
router.put('/avatar', authenticateToken, AuthController.updateAvatar);

module.exports = router;
