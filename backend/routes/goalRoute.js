import express from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal, getGoalProgress } from '../controller/goalController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { getExchangeRates } from '../controller/currencyController.js';

const router = express.Router();

router.post('/create', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.put('/:id', authenticate, updateGoal);
router.delete('/:id', authenticate, deleteGoal);
router.get('/progress', authenticate, getGoalProgress);
router.get('/exchange-rates', getExchangeRates);


export default router;
