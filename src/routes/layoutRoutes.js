const express = require('express');
const { body, param } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  saveLayout,
  getLayouts,
  getLayoutById,
  updateLayout,
  deleteLayout,
  deleteFavoriteLayout,
  deleteFavoriteLayouts,
} = require('../controllers/layoutController');

const router = express.Router();

const layoutBodyValidation = [
  body('name').isString().trim().isLength({ min: 1, max: 120 }),
  body('mode').isIn(['free', 'grid']),
  body('windows').isArray(),
  body('order').optional().isArray(),
  body('isFavorite').optional().isBoolean(),
  body('dashboardData').optional().isObject(),
];

router.use(auth);

router.post('/save', layoutBodyValidation, validate, saveLayout);
router.get('/', getLayouts);
router.delete('/favorites', deleteFavoriteLayouts);
router.delete('/favourites', deleteFavoriteLayouts);
router.delete('/favorites/:id', [param('id').isMongoId()], validate, deleteFavoriteLayout);
router.delete('/favourites/:id', [param('id').isMongoId()], validate, deleteFavoriteLayout);
router.get('/:id', [param('id').isMongoId()], validate, getLayoutById);
router.put('/:id', [param('id').isMongoId(), ...layoutBodyValidation], validate, updateLayout);
router.delete('/:id', [param('id').isMongoId()], validate, deleteLayout);

module.exports = router;
