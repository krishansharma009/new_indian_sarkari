// controllers/userController.js
const REST_API = require('../../utils/curdHelper');
const User = require('./user');

const userController = {
  getAll: async (req, res) => {
    try {
      const result = await REST_API.getAll(User, req.query, {
        attributes: { exclude: ['password', 'refreshToken'] }
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(User, 'id', req.params.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
      });
      res.json(result[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      // Only allow updating own profile or if admin/superadmin
      if (req.user.role === 'user' && req.user.id !== parseInt(req.params.id)) {
        throw new Error('Unauthorized to update other users');
      }

      const result = await REST_API.update(User, req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      // Only admin/superadmin can delete users
      if (req.user.role === 'user') {
        throw new Error('Unauthorized to delete users');
      }

      // Prevent deleting superadmin
      const user = await User.findByPk(req.params.id);
      if (user.role === 'superadmin') {
        throw new Error('Cannot delete superadmin account');
      }

      await REST_API.delete(User, req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;