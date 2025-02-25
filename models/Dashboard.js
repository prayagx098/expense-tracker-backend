// models/Dashboard.js
const mongoose = require("mongoose");

const DashboardSchema = new mongoose.Schema({
  fkUserLoginId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
},
{ collection: "dashboard" });

module.exports = mongoose.model("Dashboard", DashboardSchema);
