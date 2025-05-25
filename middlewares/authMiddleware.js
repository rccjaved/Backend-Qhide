const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
  let token = null;

  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to cookie
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ error: 'Please Login First' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.role = decoded.role;
    req.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
