const AuthService = require('../services/authService');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = AuthService.login(username, password);
      return res.status(200).json({
        success: true,
        message: 'Autenticación exitosa',
        data: result
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getMe(req, res) {
    try {
      const userId = req.user.id;
      const user = AuthService.getProfile(userId);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al obtener datos del usuario'
      });
    }
  }

  static async updateAvatar(req, res) {
    try {
      const userId = req.user.id;
      const { avatar } = req.body;
      const updatedUser = AuthService.updateAvatar(userId, avatar);
      return res.status(200).json({
        success: true,
        message: 'Foto de perfil actualizada correctamente',
        data: updatedUser
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al actualizar foto de perfil'
      });
    }
  }
}

module.exports = AuthController;
