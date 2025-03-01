const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  fkUserLoginId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  month: {
    type: String,
    required: true,
  },
  transactions: [
    {
      title: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      isIncome: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Expense', ExpenseSchema);