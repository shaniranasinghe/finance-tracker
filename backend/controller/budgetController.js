import Budget from '../model/budgetModel.js';
import { convertCurrency } from '../utils/currencyUtils.js';
import SystemSettings from "../model/systemSettingsModel.js";
import Transaction from "../model/transactionModel.js";

export const addBudget = async (req, res) => {
  try {
    const { category, amount, month, currency } = req.body;

    // Retrieve system settings
    const settings = await SystemSettings.findOne();
    if (!settings) {
      return res.status(400).json({ message: "System settings not configured" });
    }

    // Validate category
    if (!settings.categories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed categories: ${settings.categories.join(", ")}` });
    }

    // Validate limit
    const limit = settings.limits.get(category);
    if (limit && amount > limit) {
      return res.status(400).json({ message: `Budget exceeds limit for category '${category}'. Maximum allowed: ${limit}` });
    }

    const newBudget = new Budget({
      userId: req.user._id,
      category,
      month,
      amount,
      currency: currency || 'USD', // Default to USD if currency is not provided
    });

    const savedBudget = await newBudget.save();

    res.status(201).json({ message: "Budget created successfully", budget: savedBudget });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create budget', error: err.message });
  }
};

// Notify users based on their spending
export const notifyUser = (budget) => {
  const percentageSpent = (budget.spentAmount / budget.amount) * 100;
  let recommendations = '';

  if (percentageSpent >= 100) {
    recommendations = 'Consider increasing your budget or reducing spending in this category.';
    return {
      status: 'Exceeded budget',
      message: `You have exceeded your budget for ${budget.category}. ${recommendations}`,
      alertLevel: 'danger',
    };
  } else if (percentageSpent >= 80) {
    recommendations = 'Monitor your spending to avoid exceeding the budget.';
    return {
      status: 'Nearing budget limit',
      message: `You are nearing your budget limit for ${budget.category}. ${recommendations}`,
      alertLevel: 'warning',
    };
  } else {
    recommendations = 'You are doing great! Maintain this spending pattern.';
    return {
      status: 'Under budget',
      message: `You're within your budget for ${budget.category}. ${recommendations}`,
      alertLevel: 'success',
    };
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ userId });

    if (!budgets || budgets.length === 0) {
      return res.status(404).json({ message: "No budgets found" });
    }

    const recommendations = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          { $match: { user: userId, category: budget.category, type: "expense" } },
          { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
        ]);

        const spentAmount = spent.length > 0 ? spent[0].totalSpent : 0;
        const percentageSpent = (spentAmount / budget.amount) * 100;

        let status, recommendation;
        if (percentageSpent >= 100) {
          status = "Exceeded budget";
          recommendation = `You have exceeded your budget for ${budget.category}. Consider increasing your budget or reducing spending in this category.`;
        } else if (percentageSpent >= 80) {
          status = "Nearing budget limit";
          recommendation = `You are nearing your budget limit for ${budget.category}. Monitor your spending to avoid exceeding the budget.`;
        } else {
          status = "Under budget";
          recommendation = `You're within your budget for ${budget.category}. You are doing great! Maintain this spending pattern.`;
        }

        return {
          category: budget.category,
          status,
          recommendation,
        };
      })
    );

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recommendations", error: error.message });
  }
};

// Fetch all budgets with converted amounts
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ userId });

    const budgetsWithConvertedAmounts = await Promise.all(
      budgets.map(async (budget) => {
        const fromCurrency = budget.currency; // Original currency
        const toCurrency = "USD"; // Target currency

        const convertedAmount = await convertCurrency(budget.amount, fromCurrency, toCurrency);
        const convertedSpentAmount = await convertCurrency(budget.spentAmount, fromCurrency, toCurrency);

        return {
          ...budget._doc,
          originalCurrency: fromCurrency,
          convertedCurrency: toCurrency,
          convertedAmount,
          convertedSpentAmount,
        };
      })
    );

    res.status(200).json(budgetsWithConvertedAmounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch budgets', error: err.message });
  }
};

export const spendAmount = async (req, res) => {
  try {
    const { category, amountSpent } = req.body;

    const budget = await Budget.findOne({ userId: req.user._id, category });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.spentAmount += amountSpent;
    await budget.save();

    res.status(200).json({ message: 'Amount spent updated', budget });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update spent amount', error: err.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { category, amount, month, currency } = req.body; // Added currency field
    const budgetId = req.params.id;

    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { category, amount, month, currency }, // Ensure currency is updated
      { new: true }
    );

    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });

    res.status(200).json(updatedBudget);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update budget', error: err.message });
  }
};


export const deleteBudget = async (req, res) => {
  try {
    const budgetId = req.params.id;

    const deletedBudget = await Budget.findByIdAndDelete(budgetId);

    if (!deletedBudget) return res.status(404).json({ message: 'Budget not found' });

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete budget', error: err.message });
  }
};

// Check if the user is nearing or exceeding their budget
export const checkBudgetStatus = (budget) => {
  if (budget.spentAmount >= budget.amount) {
    return 'Exceeded budget';
  } else if (budget.spentAmount >= budget.amount * 0.8) {
    return 'Nearing budget limit';
  } else {
    return 'Under budget';
  }
};
