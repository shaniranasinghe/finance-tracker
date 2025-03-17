import Transaction from '../model/transactionModel.js';
import Budget from '../model/budgetModel.js';
import { calculateNextNotificationDate } from '../utils/dateUtils.js';
import { convertCurrency } from '../utils/currencyUtils.js';
import { sendEmailNotification } from '../utils/emailService.js';
import SystemSettings from "../model/systemSettingsModel.js";

// Create income or expense transaction
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, currency } = req.body;

    // Retrieve system settings
    const settings = await SystemSettings.findOne();
    if (!settings) {
      return res.status(400).json({ message: "System settings not configured" });
    }

    // Validate category
    if (!settings.categories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed categories: ${settings.categories.join(", ")}` });
    }

    // Check if the currency is provided (if not, default to USD)
    const userCurrency = currency || 'USD'; // Assume the user's currency is provided

    if (type === 'income') {
      const budget = await Budget.findOne({ userId: req.user._id });

      if (!budget) {
        return res.status(404).json({ message: 'Budget not found for user' });
      }

      // Convert the income amount to the budget's currency before adding
      const convertedAmount = await convertCurrency(amount, userCurrency, budget.currency || 'USD');
      budget.amount += convertedAmount; // Add income to the budget in the correct currency
      await budget.save();

      const newTransaction = new Transaction({ ...req.body, userId: req.user._id });
      const savedTransaction = await newTransaction.save();

      return res.status(201).json({ message: 'Income transaction created', transaction: savedTransaction });
    }

    if (type === 'expense') {
      if (!category) {
        return res.status(400).json({ message: 'Category is required for expense transactions' });
      }

      const budget = await Budget.findOne({ userId: req.user._id, category });

      if (!budget) {
        return res.status(404).json({ message: 'No matching budget for this category' });
      }

      // Convert the expense amount to the budget's currency before deducting
      const convertedAmount = await convertCurrency(amount, userCurrency, budget.currency || 'USD');
      if (budget.spentAmount + convertedAmount > budget.amount) {
        return res.status(400).json({ message: 'Insufficient budget for this category' });
      }

      budget.spentAmount += convertedAmount; // Deduct expense from the correct currency
      await budget.save();

      const newTransaction = new Transaction({ ...req.body, userId: req.user._id });
      const savedTransaction = await newTransaction.save();

      return res.status(201).json({ message: 'Expense transaction created', transaction: savedTransaction });
    }

    return res.status(400).json({ message: 'Invalid transaction type. Must be either income or expense.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
};


// Retrieve all transactions for the logged-in user
export const getTransactions = async (req, res) => {  
    try {
      const transactions = await Transaction.find({ userId: req.user._id });
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};



// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { amount } = req.body;

    // Check if the updated amount is negative
    if (amount !== undefined && amount < 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter by tags
export const filterByTags = async (req, res) => {
  const userId = req.user._id;
  const { tags } = req.query;

  try {
    const filter = { userId };
    if (tags) {
      filter.tags = { $in: tags.split(',') }; // Split tags by comma and filter by them
    }

    const transactions = await Transaction.find(filter);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a recurring transaction
export const createRecurringTransaction = async (req, res) => {
  try {
    const { amount, category, recurrencePattern, endDate, currency } = req.body;

    if (!recurrencePattern || !endDate) {
      return res.status(400).json({ error: 'Recurrence pattern and end date are required.' });
    }

    const newTransaction = new Transaction({
      userId: req.user._id,
      type: 'expense',
      amount,
      category,
      currency,
      isRecurring: true,
      recurrencePattern,
      endDate,
      nextNotificationDate: calculateNextNotificationDate(new Date(), recurrencePattern),
    });

    // Adjust budget
    const budget = await Budget.findOne({ userId: req.user._id, category });
    if (!budget) return res.status(404).json({ message: 'No matching budget for this category' });

    const convertedAmount = amount; // Add currency conversion logic if needed
    if (budget.spentAmount + convertedAmount > budget.amount) {
      return res.status(400).json({ message: 'Insufficient budget for this category' });
    }

    budget.spentAmount += convertedAmount;
    await budget.save();

    await newTransaction.save();
    res.status(201).json({ message: 'Recurring transaction created successfully.', transaction: newTransaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Process recurring transactions
export const processRecurringTransactions = async () => {
  try {
    const today = new Date();
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      nextNotificationDate: { $lte: today },
      endDate: { $gte: today },
    });

    for (const transaction of recurringTransactions) {
      const budget = await Budget.findOne({ userId: transaction.userId, category: transaction.category });

      if (budget) {
        const convertedAmount = transaction.amount; // Add currency conversion logic if needed
        if (budget.spentAmount + convertedAmount <= budget.amount) {
          budget.spentAmount += convertedAmount;
          await budget.save();
        }

        transaction.nextNotificationDate = calculateNextNotificationDate(today, transaction.recurrencePattern);
        await transaction.save();

        // Send email notification
        await sendEmailNotification(
          'shaniranasinghe2001@example.com', // Replace with the actual user's email
          'Recurring Transaction Reminder',
          `A recurring transaction of ${transaction.amount} for ${transaction.category} has been processed.`
        );
      }
    }
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
  }
};


// Get recurring transactions
export const getRecurringTransactions = async (req, res) => {
  try {
    const recurringTransactions = await Transaction.find({ userId: req.user._id, isRecurring: true });
    res.status(200).json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Transaction.find({
        userId,
        isRecurring: true,
        nextNotificationDate: { $lte: new Date() },
    });

    // Send bill payment reminders
    notifications.forEach(transaction => {
      const message = `Reminder: Your bill of ${transaction.amount} is due on ${transaction.nextNotificationDate}.`;
      sendEmailNotification('user-email@example.com', 'Bill Payment Reminder', message);
    });

    // Check for unusual spending as well
    const unusualSpendingAlert = await notifyUnusualSpending(userId);
    if (unusualSpendingAlert) {
      notifications.push(unusualSpendingAlert);
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const notifyUnusualSpending = async (userId) => {
  const transactions = await Transaction.find({ userId });
  
  // Example rule: flag transactions that are higher than 150% of the average transaction amount
  const averageAmount = transactions.reduce((acc, trans) => acc + trans.amount, 0) / transactions.length;

  const unusualTransactions = transactions.filter(trans => trans.amount > averageAmount * 1.5);

  if (unusualTransactions.length) {
    const alertMessage = `You have unusual spending patterns, particularly with transactions over ${averageAmount * 1.5}.`;

    // Send email to the user
    await sendEmailNotification('shaniranasinghe2001@gmail.com', 'Unusual Spending Alert', alertMessage);

    return {
      status: 'Unusual Spending Detected',
      message: alertMessage,
      alertLevel: 'warning',
    };
  }

  return null;
};

// Retrieve all transactions for a specific user (Admin functionality)
export const getAllUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from route parameters

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch transactions for the specified user
    const transactions = await Transaction.find({ userId });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the specified user' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, tags } = req.query;

    // Build query filters
    const filters = {};
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) filters.category = category;
    if (tags) filters.tags = { $in: tags.split(",") };

    // Fetch all transactions and populate user information
    const transactions = await Transaction.find(filters).populate("userId", "username email");

    // Group by user for better organization
    const groupedTransactions = transactions.reduce((acc, transaction) => {
      // Check if userId is valid and populated
      if (!transaction.userId) {
        console.warn(`Skipping transaction with missing userId: ${transaction._id}`);
        return acc;
      }

      const user = transaction.userId; // Populated user information
      if (!acc[user._id]) {
        acc[user._id] = {
          username: user.username,
          email: user.email,
          transactions: [],
        };
      }
      acc[user._id].transactions.push(transaction);
      return acc;
    }, {});

    res.status(200).json(groupedTransactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all transactions.", details: error.message });
  }
};


// Sort transactions by tags
export const sortTransactionsByTags = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tags } = req.query;

    // Fetch and sort transactions
    const transactions = await Transaction.find({ userId, tags: { $in: tags.split(",") } }).sort("tags");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to sort transactions by tags.", details: error.message });
  }
};



