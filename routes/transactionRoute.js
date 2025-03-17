import express from 'express';
import {authenticate, authorizeRole, isAdminMiddleware} from '../middleware/authMiddleware.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  filterByTags,
  createRecurringTransaction,
  getRecurringTransactions,
  getNotifications,
  getAllUserTransactions,
  getAllTransactions,
  sortTransactionsByTags ,
} from '../controller/transactionController.js';
import { getExchangeRates } from '../controller/currencyController.js';

const router = express.Router();

// Define routes and attach corresponding controllers
router.post('/', authenticate, authorizeRole(['regular_user']), createTransaction);
router.get('/', authenticate, authorizeRole(['regular_user']), getTransactions);
router.put('/:id', authenticate, authorizeRole(['regular_user']), updateTransaction);
router.delete('/:id', authenticate, authorizeRole(['regular_user']), deleteTransaction);
router.get('/user/:userId', isAdminMiddleware, getAllUserTransactions);
router.get('/transactions', authenticate, filterByTags);
router.post('/recurring', authenticate, createRecurringTransaction);
router.get('/recurring', authenticate, getRecurringTransactions);
router.get('/notifications', authenticate, getNotifications);
router.get('/exchange-rates', getExchangeRates);

// Admin can view all transactions
router.get("/admin/all", authenticate, authorizeRole(["admin"]), getAllTransactions);

// Add endpoint for sorting transactions by tags
router.get("/sort-by-tags", authenticate, sortTransactionsByTags);


export default router;