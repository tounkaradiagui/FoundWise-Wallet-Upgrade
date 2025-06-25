import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Initialize DB connection
async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection failed:', error);
    process.exit(1);
  }
}

// API endpoint to check if the backend is working
app.use('/', (req, res, next) => {
  console.log('Hey we hit a req, the method is : ', req.method);
  next();
});

// API endpoint to check if the backend is working
app.get('/', (req, res) => {
  res.send('Backend is working ');
});

// API endpoint to create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "Tous les champs sont réquis" });
    }

    const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category) 
      VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;

    console.log('Transaction created:', transaction[0]);

    res.status(201).json(transaction[0]);

  } catch (error) {
    console.log('Erreur lors de la création de la transaction:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
  }
});

// API endpoint to get transactions by user ID
app.get('/api/transactions/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Aucune transaction trouvée pour cet utilisateur' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }
});

// API endpoint to get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }
});


// API endpoint to delete a transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'ID de transaction invalide' });
    }
    const transaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (transaction.length === 0) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    res.status(200).json({ message: 'Transaction supprimée avec succès', transaction: transaction[0] });
  } catch (error) {
    console.log('Erreur lors de la suppression de la transaction:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la transaction' });
  }
});

// API endpoint to get transactions summary by user ID
app.get('/api/transactions/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get balance for the user
    const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;

    // Get income for the user
    const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    // Get expenses for the user
    const expensesResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    // User must have at least an income before creating an expense
    // if (incomeResult[0].income <= 0 && expensesResult[0].expenses < 0) {
    //   return res.status(400).json({ message: 'Vous devez d\'abord créer une entrée avant de créer une dépense' });

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses
    });
  } catch (error) {
    console.log('Erreur lors de la récupération du résumé des transactions:', error);
    res.status(500).json({ message: 'Erreur de serveur' });

  }
});

// API endpoint to initialize the database and start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 