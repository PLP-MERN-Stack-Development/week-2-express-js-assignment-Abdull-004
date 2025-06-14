const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Get all products (with optional filtering and pagination)
router.get('/', (req, res) => {
    const products = req.app.locals.products;
    // Filtering by category
    let filteredProducts = [...products];
    if (req.query.category) {
        filteredProducts = filteredProducts.filter(
            p => p.category === req.query.category
        );
    }

    // Pagination 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < filteredProducts.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page -1,
            limit: limit
        };
    }

    results.results = filteredProducts.slice(startIndex, endIndex);
    res.json(results);
});

// Posting a new product
router.post('/', (req, res, next) => {
    const products = req.app.locals.products;
    const { name, description, price, category, inStock } = req.body;
    
    if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
        const error = new Error('Missing or invalid fields');
        error.status = 400;
        return next(error); 
    }

    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Updating a product
router.put('/:id', (req, res, next) => {
    const products = req.app.locals.products;
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
        const error = new Error('Product not found');
        error.status = 404;
        return next(error);
    }

    const { name, description, price, category, inStock } = req.body;

    products[productIndex] = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        description: description || products[productIndex].description,
        price: price || products[productIndex].price,
        category: category || products[productIndex].category,
        inStock: typeof inStock === 'boolean' ? inStock : products[productIndex].inStock
    };
    res.json(products[productIndex]);
});

// Deleting a product
router.delete('/:id', (req, res, next) => {
    const products = req.app.locals.products;
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
        const error = new Error('Product not found');
        error.status = 404;
        return next(error);
    }

    products.splice(productIndex, 1);
    res.status(204).send();  // Changed from 201 to 204 (No Content)
});

// Search endpoint
router.get('/search/:term', (req, res) => {
    const products = req.app.locals.products;
    const term = req.params.term.toLowerCase();
    const results = products.filter(p =>
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
    );
    res.json(results);
});

// Statistics endpoint 
router.get('/stats/categories', (req,res) => {
    const products = req.app.locals.products;
    const stats = {};
    products.forEach(product => {
        if (!stats[product.category]) {
            stats[product.category] = 0;
        }
        stats[product.category]++;
    });
    res.json(stats);
});

module.exports = router;