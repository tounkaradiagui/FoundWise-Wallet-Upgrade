import express from 'express';
import { createTransaction, deleteTransactionById, getAllTransactions, getTransactionsByUserId, getTransactionsSummaryByUserId } from '../controllers/transactionsController.js';

const router = express.Router();

// API endpoint to check if the backend is working
router.get('/health', (req, res) => {
  res.send('Backend is working ');
});

// API endpoint to create a new transaction
router.post('/', createTransaction);

// API endpoint to get transactions by user ID
router.get('/:userId', getTransactionsByUserId);

// API endpoint to get all transactions
router.get('/', getAllTransactions);


// API endpoint to delete a transaction by ID
router.delete('/:id', deleteTransactionById);

// API endpoint to get transactions summary by user ID
router.get('/summary/:userId', getTransactionsSummaryByUserId);


export default router;