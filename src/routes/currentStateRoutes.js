const express = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getCurrentState,
  upsertCurrentState,
} = require('../controllers/currentStateController');

const router = express.Router();

router.use(auth);

router.get('/', getCurrentState);
router.put(
  '/',
  [
    body('mode').optional().isIn(['free', 'grid']),
    body('windows').optional().isArray(),
    body('order').optional().isArray(),
    body('dashboardData').optional().isObject(),
  ],
  validate,
  upsertCurrentState
);

module.exports = router;
