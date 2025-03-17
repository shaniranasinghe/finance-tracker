import express from 'express';
import { 
  addBudget, 
  getBudgets, 
  updateBudget, 
  deleteBudget,
  spendAmount,
  getRecommendations
} from '../controller/budgetController.js';
import { authenticate, authorizeRole } from '../middleware/authMiddleware.js';
import { getExchangeRates } from '../controller/currencyController.js';

const router = express.Router();

// Add a new budget
router.post('/', authenticate, authorizeRole(['regular_user']), addBudget);

// Get budgets for a user
router.get('/', authenticate, authorizeRole(['regular_user']), getBudgets);

// Update a budget
router.put('/:id', authenticate, authorizeRole(['regular_user']), updateBudget);

// Delete a budget
router.delete('/:id', authenticate, authorizeRole(['regular_user']), deleteBudget);

// Spend money in a budget category
router.put('/spend', authenticate, spendAmount);

router.get("/recommendations", authenticate, getRecommendations);
router.get('/exchange-rates', getExchangeRates);

export default router;
