// recurringTransactionJob.js
import cron from 'node-cron';
import { processRecurringTransactions } from '../controller/transactionController.js';

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Processing recurring transactions...');
  await processRecurringTransactions();
});
