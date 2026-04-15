const mongoose = require('mongoose');

const currentStateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    mode: { type: String, enum: ['free', 'grid'], default: 'free' },
    windows: { type: [mongoose.Schema.Types.Mixed], default: [] },
    order: { type: [String], default: [] },
    dashboardData: {
      scalingData: { type: mongoose.Schema.Types.Mixed, default: {} },
      driverData: { type: mongoose.Schema.Types.Mixed, default: {} },
      cargoItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
      taxCalculations: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    updatedAtClient: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CurrentState', currentStateSchema);
