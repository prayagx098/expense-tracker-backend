const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dashboard = require('../models/Dashboard'); 
const bcrypt = require('bcrypt');

// Register User Route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hardcoded isAdmin as false
        user = new User({ username, password: hashedPassword, isAdmin: false });

        await user.save();

        // Create Dashboard for the user
        const dashboard = new Dashboard({
            fkUserLoginId: user._id,
            userName: user.username,
            month: new Date().toLocaleString('default', { month: 'long' }),
            totalIncome: 0,
            totalExpense: 0,
            netSavings: 0
        });

        await dashboard.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
