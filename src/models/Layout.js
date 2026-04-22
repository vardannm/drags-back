const mongoose = require('mongoose');

const windowStateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 200 },
    z: { type: Number, default: 0 },
    minimized: { type: Boolean, default: false },
  },
  { _id: false }
);

const dashboardDataSchema = new mongoose.Schema(
  {
    scalingData: { type: mongoose.Schema.Types.Mixed, default: {} },
    driverData: { type: mongoose.Schema.Types.Mixed, default: {} },
    cargoItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
    taxCalculations: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const layoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    mode: { type: String, enum: ['free', 'grid'], default: 'free' },
    windows: { type: [windowStateSchema], default: [] },
    order: { type: [String], default: [] },
    dashboardData: { type: dashboardDataSchema, default: () => ({}) },
    isFavorite: { type: Boolean, default: false },
    isLastUnsaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Layout', layoutSchema);
