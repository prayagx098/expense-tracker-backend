// routes/dashboard.js
const express = require("express");
const Dashboard = require("../models/Dashboard");
const mongoose = require("mongoose"); 
const router = express.Router();

router.get("/:userLoginId", async (req, res) => {
  try {
    const { userLoginId } = req.params;

    const userLoginObjectId = new mongoose.Types.ObjectId(userLoginId); 
    
    const dashboard = await Dashboard.findOne({ fkUserLoginId: userLoginObjectId }).exec();

    if (!dashboard) {
      return res.status(404).json({ statusCode: 404, message: "Dashboard not found" });
    }
    res.json({ statusCode: 200, userName: dashboard.userName });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ statusCode: 500, message: "Server error" });
  }
});

module.exports = router;
