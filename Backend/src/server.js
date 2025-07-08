import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import { initDB } from './controllers/transactionsController.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware
// app.use(ratelimiter); 
app.use(express.json());
// app.use(cors());

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// API endpoint to check if the backend is working
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Middleware to log requests
app.use('/', (req, res, next) => {
  console.log('Hey we hit a req, the method is : ', req.method);
  next();
});

// transactions API route
app.use('/api/transactions', transactionsRoute);

// API endpoint to initialize the database and start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 