const User = require('./user');
const REST_API = require('../../utils/curdHelper');
const auth = require('../../middleware/authMiddleware');


const AuthController = {
  signup: async (req, res) => {
    try {
      const user = await REST_API.create(User, req.body);
      const token = auth.generateToken(user.id);
      
      // Set token in cookie
      auth.setTokenCookie(res, token);
      
      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse,
        token 
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = auth.generateToken(user.id);
      
      // Set token in cookie
      auth.setTokenCookie(res, token);
      
      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        data: userResponse,
        token // Also send token in response for header-based auth
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  logout: async (req, res) => {
    try {
      // Clear the JWT cookie
      auth.clearTokenCookie(res);
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during logout'
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const result = await REST_API.getAll(User, req.query);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(User, 'id', req.params.id);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const result = await REST_API.update(User, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await REST_API.delete(User, req.params.id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = AuthController;