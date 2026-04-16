const User = require('../models/User');
const generateToken = require('../utils/generateToken');

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user._id.toString());

  return res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    },
  });
}

async function me(req, res) {
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profile: req.user.profile,
      createdAt: req.user.createdAt,
    },
  });
}

module.exports = { login, me };
