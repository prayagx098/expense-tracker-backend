const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dashboard = require('../models/Dashboard'); 
const bcrypt = require('bcrypt');

// Register User Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, isAdmin });

        await user.save();

        const dashboard = new Dashboard({
            fkUserLoginId: user._id,
            userName: user.name,
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
