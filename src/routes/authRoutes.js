const express = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { register, login, me } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 128 }),
    body('profile').optional().isObject(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  login
);

router.get('/me', auth, me);

module.exports = router;
