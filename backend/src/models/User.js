const bcrypt = require('bcryptjs');

// In-Memory User Store with pre-hashed default admin user ('admin' / 'admin123')
const usersStore = [
  {
    id: 'usr-001',
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10),
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@farmacia.com',
    role: 'Administrador de Farmacia',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T08:00:00Z').toISOString()
  },
  {
    id: 'usr-002',
    username: 'farmaceutico',
    passwordHash: bcrypt.hashSync('farmacia2026', 10),
    name: 'Dra. Elena Rostova',
    email: 'elena.rostova@farmacia.com',
    role: 'Farmacéutica Senior',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78853d470eb0?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-02-01T10:30:00Z').toISOString()
  }
];

class UserModel {
  static findByUsername(username) {
    return usersStore.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  static findById(id) {
    return usersStore.find(u => u.id === id);
  }

  static updateAvatar(id, avatarUrl) {
    const user = usersStore.find(u => u.id === id);
    if (!user) return null;
    user.avatar = avatarUrl;
    return user;
  }

  static validatePassword(plainPassword, passwordHash) {
    return bcrypt.compareSync(plainPassword, passwordHash);
  }

  static sanitize(user) {
    if (!user) return null;
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = UserModel;
