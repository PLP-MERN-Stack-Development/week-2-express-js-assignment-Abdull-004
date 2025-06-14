require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const errorHandler = require('./middleware/errorHandler');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize products directly in server.js
const products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1200,
    category: 'electronics',
    inStock: true
  }
];

// Attach products to app.locals
app.locals.products = products;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use('/api/products', authenticate, productsRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});