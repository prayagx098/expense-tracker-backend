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

router.post('/:fkUserLoginId/:month', validateObjectId, async (req, res) => {
    const { fkUserLoginId, month } = req.params;
    const { transactions } = req.body;
  
    try {
      const userId = new mongoose.Types.ObjectId(fkUserLoginId);
  
      let expense = await Expense.findOne({ fkUserLoginId: userId, month });
  
      const newTransactions = [];
      const previousMonthTransactions = {};
  
      // Helper function to check if a transaction already exists
      const isDuplicate = (existingTransactions, newTransaction) => {
        return existingTransactions.some(
          (tx) =>
            tx.title === newTransaction.title &&
            tx.amount === newTransaction.amount &&
            new Date(tx.date).toISOString() === new Date(newTransaction.date).toISOString() &&
            tx.category === newTransaction.category &&
            tx.isIncome === newTransaction.isIncome
        );
      };
  
      // Process each transaction
      transactions.forEach((tx) => {
        const transactionMonth = new Date(tx.date).toISOString().slice(0, 7);
        if (transactionMonth === month) {
          if (!expense || !isDuplicate(expense.transactions, tx)) {
            newTransactions.push(tx);
          }
        } else {
          if (!previousMonthTransactions[transactionMonth]) {
            previousMonthTransactions[transactionMonth] = [];
          }
          if (!isDuplicate(previousMonthTransactions[transactionMonth], tx)) {
            previousMonthTransactions[transactionMonth].push(tx);
          }
        }
      });
  
      // Save new transactions for the current month
      if (newTransactions.length > 0) {
        if (expense) {
          expense.transactions = [...expense.transactions, ...newTransactions];
        } else {
          expense = new Expense({ fkUserLoginId: userId, month, transactions: newTransactions });
        }
        await expense.save();
      }
  
      // Save transactions for previous months
      for (const [prevMonth, transactions] of Object.entries(previousMonthTransactions)) {
        let prevExpense = await Expense.findOne({ fkUserLoginId: userId, month: prevMonth });
        if (prevExpense) {
          prevExpense.transactions = [...prevExpense.transactions, ...transactions];
        } else {
          prevExpense = new Expense({ fkUserLoginId: userId, month: prevMonth, transactions });
        }
        await prevExpense.save();
      }
  
      // Update dashboard data
      await updateDashboard(fkUserLoginId);
  
      res.status(200).json({ message: "Transactions saved successfully" });
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