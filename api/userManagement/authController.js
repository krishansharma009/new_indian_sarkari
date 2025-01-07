// controllers/authController.js
const REST_API = require('../../utils/curdHelper');
const User = require('./user');
const auth = require('../middleware/auth');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, fullName, phone, role } = req.body;
      
      // Only superadmin can create admin users
      if (role === 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const user = await REST_API.create(User, {
        username,
        email,
        password,
        fullName,
        phone,
        role: role || 'user'
      });

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const { accessToken, refreshToken } = auth.generateTokens(user);
      
      // Update last login and refresh token
      await REST_API.update(User, user.id, {
        lastLogin: new Date(),
        refreshToken
      });

      // Set cookies for web clients
      if (req.headers['user-agent']?.toLowerCase().includes('mozilla')) {
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000 }); // 15 minutes
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 604800000 }); // 7 days
      }

      // Return tokens in response for mobile clients
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      await REST_API.update(User, req.user.id, { refreshToken: null });
      
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const tokens = auth.generateTokens(user);
      await REST_API.update(User, user.id, { refreshToken: tokens.refreshToken });

      if (req.headers['user-agent']?.toLowerCase().includes('mozilla')) {
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 900000 });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 604800000 });
      }

      res.json({ tokens });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = authController;
