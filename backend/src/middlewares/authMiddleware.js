const { verifyToken } = require('../config/jwt');
const UserModel = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado. Token JWT no proporcionado.'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o el usuario ya no existe.'
      });
    }

    req.user = UserModel.sanitize(user);
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token expirado o no es válido. Por favor inicie sesión nuevamente.'
    });
  }
};

module.exports = {
  authenticateToken
};
