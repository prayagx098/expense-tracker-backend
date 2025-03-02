// models/Dashboard.js
const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  fkUserLoginId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  month: {
    type: String,
    required: true,
  },
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 },
  netSavings: { type: Number, default: 0 },
}, { collection: 'dashboard' });

module.exports = mongoose.model('Dashboard', DashboardSchema);