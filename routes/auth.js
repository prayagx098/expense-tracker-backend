const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ statusCode: 401, message: "Invalid credentials" });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ statusCode: 401, message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { username, userId: user._id, isAdmin: user.isAdmin || false }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ 
      statusCode: 200, 
      token: token, 
      userLoginId: user._id,
      isAdmin: user.isAdmin || false
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ statusCode: 500, message: "Server error" });
  }
});

module.exports = router;
