const UserModel = require('../models/User');
const { generateToken } = require('../config/jwt');

class AuthService {
  static login(username, password) {
    if (!username || !password) {
      throw { status: 400, message: 'Usuario y contraseña son requeridos.' };
    }

    const user = UserModel.findByUsername(username);
    if (!user) {
      throw { status: 401, message: 'Credenciales inválidas. Verifique el usuario y contraseña.' };
    }

    const isValid = UserModel.validatePassword(password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: 'Credenciales inválidas. Verifique el usuario y contraseña.' };
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    return {
      token,
      user: UserModel.sanitize(user)
    };
  }

  static getProfile(userId) {
    const user = UserModel.findById(userId);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado.' };
    }
    return UserModel.sanitize(user);
  }

  static updateAvatar(userId, avatarUrl) {
    if (!avatarUrl || typeof avatarUrl !== 'string') {
      throw { status: 400, message: 'La URL de la imagen de perfil es inválida.' };
    }

    const updatedUser = UserModel.updateAvatar(userId, avatarUrl);
    if (!updatedUser) {
      throw { status: 404, message: 'Usuario no encontrado.' };
    }

    return UserModel.sanitize(updatedUser);
  }
}

module.exports = AuthService;
