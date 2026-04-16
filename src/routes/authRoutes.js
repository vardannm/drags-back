const express = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { login, me } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  login
);

router.get('/me', auth, me);

module.exports = router;
