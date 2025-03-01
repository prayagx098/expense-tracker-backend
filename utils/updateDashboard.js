// utils/updateDashboard.js
const Dashboard = require('../models/Dashboard');
const Expense = require('../models/Expense');

const updateDashboard = async (fkUserLoginId) => {
  try {
    // Fetch all expenses for the user
    const expenses = await Expense.find({ fkUserLoginId });

    // Calculate total income, total expenses, and net savings
    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((expense) => {
      expense.transactions.forEach((tx) => {
        if (tx.isIncome) {
          totalIncome += tx.amount;
        } else {
          totalExpense += tx.amount;
        }
      });
    });

    const netSavings = totalIncome - totalExpense;

    // Update the dashboard document
    await Dashboard.findOneAndUpdate(
      { fkUserLoginId },
      { totalIncome, totalExpense, netSavings },
      { upsert: true, new: true } 
    );

    console.log('Dashboard updated successfully');
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
};

module.exports = updateDashboard;