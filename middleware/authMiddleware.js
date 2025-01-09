const jwt = require('jsonwebtoken');
const User = require('../api/userManagement/user');


// You can use either hardcoded secret or env variable
const JWT_SECRET = 'your-super-secret-key-here'; // or process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h';
const COOKIE_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const authMiddleware = {
  generateToken: (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  setTokenCookie: (res, token) => {
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict'
    });
  },

  clearTokenCookie: (res) => {
    res.cookie('jwt', 'logged_out', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true
    });
  },

  protect: async (req, res, next) => {
    try {
      let token;
      
      // Check both header and cookies for token
      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
      }

      if (!token || token === 'logged_out') {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  },

  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'You do not have permission to perform this action' 
        });
      }
      next();
    };
  }
};

module.exports = authMiddleware;