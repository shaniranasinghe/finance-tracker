import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String, // e.g., Food, Transportation
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  spentAmount: {
    type: Number,
    default: 0, // tracks how much the user has spent in this category
  },
  month: {
    type: String, // e.g., 'March-2025'
    required: true,
  },
  currency: {
    type: String, 
    default: 'USD',
    required: true 
  }, // e.g., USD, EUR
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Budget = mongoose.model('budget', BudgetSchema);
export default Budget;
