const Layout = require('../models/Layout');

function normalizeLayoutBody(body) {
  const normalized = {
    name: body.name,
    mode: body.mode,
    windows: Array.isArray(body.windows) ? body.windows : [],
    order: Array.isArray(body.order) ? body.order : [],
    dashboardData: {
      scalingData: body.dashboardData?.scalingData || {},
      driverData: body.dashboardData?.driverData || {},
      cargoItems: Array.isArray(body.dashboardData?.cargoItems)
        ? body.dashboardData.cargoItems
        : [],
      taxCalculations: body.dashboardData?.taxCalculations || {},
    },
  };

  if (Object.prototype.hasOwnProperty.call(body, 'isFavorite')) {
    normalized.isFavorite = Boolean(body.isFavorite);
  }

  return normalized;
}

async function saveLayout(req, res) {
  const payload = normalizeLayoutBody(req.body);

  const layout = await Layout.create({
    user: req.user._id,
    ...payload,
  });

  return res.status(201).json(layout);
}

async function getLayouts(req, res) {
  const layouts = await Layout.find({ user: req.user._id }).sort({ updatedAt: -1 });
  return res.status(200).json(layouts);
}

async function getLayoutById(req, res) {
  const layout = await Layout.findOne({ _id: req.params.id, user: req.user._id });
  if (!layout) {
    return res.status(404).json({ message: 'Layout not found.' });
  }

  return res.status(200).json(layout);
}

async function updateLayout(req, res) {
  const payload = normalizeLayoutBody(req.body);
  const layout = await Layout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    payload,
    { new: true, runValidators: true }
  );

  if (!layout) {
    return res.status(404).json({ message: 'Layout not found.' });
  }

  return res.status(200).json(layout);
}

async function deleteLayout(req, res) {
  const result = await Layout.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!result) {
    return res.status(404).json({ message: 'Layout not found.' });
  }

  return res.status(204).send();
}

async function deleteFavoriteLayout(req, res) {
  const result = await Layout.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
    isFavorite: true,
  });

  if (!result) {
    return res.status(404).json({ message: 'Favorite layout not found.' });
  }

  return res.status(204).send();
}

async function deleteFavoriteLayouts(req, res) {
  const result = await Layout.deleteMany({
    user: req.user._id,
    isFavorite: true,
  });

  return res.status(200).json({
    deletedCount: result.deletedCount || 0,
  });
}

module.exports = {
  saveLayout,
  getLayouts,
  getLayoutById,
  updateLayout,
  deleteLayout,
  deleteFavoriteLayout,
  deleteFavoriteLayouts,
};
