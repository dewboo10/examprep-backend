const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);
  console.log('🔒 Token received:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, _id: decoded.id };
    req.userId = decoded.id;
    console.log('✅ Token verified for user:', req.user.id);
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
