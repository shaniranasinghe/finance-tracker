import Transaction from '../model/transactionModel.js';
import mongoose from "mongoose";


// Spending Trends Over Time
export const getSpendingTrends = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    // Aggregate spending trends
    const transactions = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Return data
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch spending trends.", details: error.message });
  }
};



// Income vs. Expense Summary
export const getIncomeExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    // Aggregate income and expense data
    const summary = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$type", // Group by transaction type (income/expense)
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Return data
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income/expense summary.", details: error.message });
  }
};



// Filtered Reports by Category, Tags, or Time Period
export const getFilteredReports = async (req, res) => {
  try {
    const { startDate, endDate, category, tags } = req.query;

    // Build query filters
    const filters = {};
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) filters.category = category;
    if (tags) filters.tags = { $in: tags.split(",") };

    // Fetch filtered transactions
    const transactions = await Transaction.find(filters);

    // Return data
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch filtered reports.", details: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { startDate, endDate, category, tags } = req.query;

    // Build query filters
    const filters = {};
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) filters.category = category;
    if (tags) filters.tags = { $in: tags.split(",") };

    // Fetch all transactions across users
    const transactions = await Transaction.find(filters);

    // Group by user and category for better reporting
    const groupedReports = transactions.reduce((acc, transaction) => {
      const userId = transaction.userId.toString();
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(transaction);
      return acc;
    }, {});

    res.status(200).json(groupedReports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin reports.", details: error.message });
  }
};



