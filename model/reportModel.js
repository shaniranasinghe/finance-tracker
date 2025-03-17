// models/report.js (optional)
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: Date,
  endDate: Date,
  totalIncome: Number,
  totalExpenses: Number,
  categoriesSummary: [
    {
      category: String,
      income: Number,
      expense: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
