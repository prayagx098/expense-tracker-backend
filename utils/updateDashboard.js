const Dashboard = require('../models/Dashboard');
const Expense = require('../models/Expense');

const updateDashboard = async (fkUserLoginId) => {
  try {
    // Get the current month in "YYYY-MM" format
    const now = new Date();
    const currentYear = now.getFullYear(); // e.g., 2023
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // e.g., "03" for March
    const currentMonthKey = `${currentYear}-${currentMonth}`; // e.g., "2023-03"

    // Fetch expenses for the user for the current month
    const expenses = await Expense.find({
      fkUserLoginId,
      month: currentMonthKey, // Filter by the current month in "YYYY-MM" format
    });

    // Calculate total income, total expenses, and net savings for the current month
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

    // Update the dashboard document for the current month
    await Dashboard.findOneAndUpdate(
      { fkUserLoginId }, // Filter by user and current month
      { totalIncome, totalExpense, netSavings },
      { upsert: true, new: true } // Create if it doesn't exist
    );

    console.log(`Dashboard updated successfully`);
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
};

module.exports = updateDashboard;