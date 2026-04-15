const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: missing token.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: user not found.' });
    }

    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Unauthorized: invalid token.' });
  }
}

module.exports = auth;
