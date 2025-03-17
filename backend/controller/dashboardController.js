import User from "../model/userModel.js";
import Transaction from "../model/transactionModel.js";
import Budget from "../model/budgetModel.js";
import Goal from "../model/goalModel.js";

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    // Total number of users
    const userCount = await User.countDocuments();

    // Total transactions and system activity
    const transactionStats = await Transaction.aggregate([
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // Summary response
    res.status(200).json({
      totalUsers: userCount,
      transactionStats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin dashboard data", details: error.message });
  }
};

// User Dashboard
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // User-specific transactions
    const transactionSummary = await Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // User budgets
    const budgets = await Budget.find({ userId });

    // User goals
    const goals = await Goal.find({ userId });

    // Summary response
    res.status(200).json({
      transactionSummary,
      budgets,
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user dashboard data", details: error.message });
  }
};
