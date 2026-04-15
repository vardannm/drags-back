const CurrentState = require('../models/CurrentState');

async function getCurrentState(req, res) {
  const state = await CurrentState.findOne({ user: req.user._id });

  if (!state) {
    return res.status(200).json({
      mode: 'free',
      windows: [],
      order: [],
      dashboardData: {
        scalingData: {},
        driverData: {},
        cargoItems: [],
        taxCalculations: {},
      },
      updatedAtClient: null,
    });
  }

  return res.status(200).json(state);
}

async function upsertCurrentState(req, res) {
  const payload = {
    mode: req.body.mode || 'free',
    windows: Array.isArray(req.body.windows) ? req.body.windows : [],
    order: Array.isArray(req.body.order) ? req.body.order : [],
    dashboardData: {
      scalingData: req.body.dashboardData?.scalingData || {},
      driverData: req.body.dashboardData?.driverData || {},
      cargoItems: Array.isArray(req.body.dashboardData?.cargoItems)
        ? req.body.dashboardData.cargoItems
        : [],
      taxCalculations: req.body.dashboardData?.taxCalculations || {},
    },
    updatedAtClient: req.body.updatedAtClient || null,
  };

  const state = await CurrentState.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, ...payload },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(state);
}

module.exports = { getCurrentState, upsertCurrentState };
