const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const updateDashboard = require('../utils/updateDashboard');
const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { fkUserLoginId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(fkUserLoginId)) {
    return res.status(400).json({ message: 'Invalid fkUserLoginId' });
  }
  next();
};

// Create or Update Expense for a specific month
router.post('/:fkUserLoginId/:month', validateObjectId, async (req, res) => {
  const { fkUserLoginId, month } = req.params;
  const { transactions } = req.body;

  try {
    // Convert fkUserLoginId to ObjectId
    const userId = new mongoose.Types.ObjectId(fkUserLoginId);

    let expense = await Expense.findOne({ fkUserLoginId: userId, month });

    if (expense) {
      expense.transactions = transactions;
    } else {
      expense = new Expense({ fkUserLoginId: userId, month, transactions });
    }

    await expense.save();

    // Update dashboard data
    await updateDashboard(fkUserLoginId);
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Expense for a specific month
router.get('/:fkUserLoginId/:month', validateObjectId, async (req, res) => {
  const { fkUserLoginId, month } = req.params;
  console.log(fkUserLoginId, month);
  

  try {
    // Convert fkUserLoginId to ObjectId
    const userId = new mongoose.Types.ObjectId(fkUserLoginId);

    const expense = await Expense.findOne({ fkUserLoginId: userId, month });
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific transaction by ID
router.delete('/:fkUserLoginId/:month/:transactionId', async (req, res) => {
    const { fkUserLoginId, month, transactionId } = req.params;
  
    try {
      const expense = await Expense.findOne({ fkUserLoginId, month });
      if (expense) {
        expense.transactions = expense.transactions.filter(
          (tx) => tx._id.toString() !== transactionId
        );
        await expense.save();

        // Update dashboard data
      await updateDashboard(fkUserLoginId);
        res.status(200).json({ message: 'Transaction deleted successfully' });
      } else {
        res.status(404).json({ message: 'Expense not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;