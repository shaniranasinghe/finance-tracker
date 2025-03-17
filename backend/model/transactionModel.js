import mongoose from 'mongoose';
import SystemSettings from './systemSettingsModel.js';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value >= 0;
          },
          message: 'Amount must be a positive number',
        },
      },
      category: {
        type: String,
        required: false,
      },
    tags: { type: [String] },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly'], required: false },
    endDate: { type: Date, required: false },
    nextNotificationDate: { type: Date, required: false },
    notificationSent: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    currency: { type: String, required: true }, // e.g., USD, EUR
    convertedAmount: { type: Number, default: null },
}, { timestamps: true });

// Validate category and amount dynamically based on admin settings
transactionSchema.pre('validate', async function (next) {
  try {
    const settings = await SystemSettings.findOne();
    if (settings) {
      // Validate category
      if (!settings.categories.includes(this.category)) {
        throw new Error(`Category '${this.category}' is not allowed.`);
      }

      // Validate amount
      if (this.amount > settings.transactionLimit) {
        throw new Error(`Amount exceeds the allowed limit of ${settings.transactionLimit}.`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to calculate total spending for a user
transactionSchema.statics.calculateTotalSpending = async function (userId) {
  const total = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalSpending: { $sum: '$amount' } } },
  ]);

  return total.length > 0 ? total[0].totalSpending : 0;
};

// Method to get transactions by category
transactionSchema.statics.getTransactionsByCategory = async function (userId) {
  const transactions = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
  ]);

  return transactions;
};

// Export the Transaction model
export default mongoose.model('Transaction', transactionSchema);