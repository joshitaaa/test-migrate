const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample product data
const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop for work and gaming',
    image: 'https://via.placeholder.com/200x200?text=Laptop',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 699.99,
    description: 'Latest smartphone with advanced features',
    image: 'https://via.placeholder.com/200x200?text=Smartphone',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Headphones',
    price: 149.99,
    description: 'Wireless noise-cancelling headphones',
    image: 'https://via.placeholder.com/200x200?text=Headphones',
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 79.99,
    description: 'Automatic coffee maker with timer',
    image: 'https://via.placeholder.com/200x200?text=Coffee+Maker',
    category: 'Home'
  },
  {
    id: 5,
    name: 'Backpack',
    price: 49.99,
    description: 'Durable travel backpack with laptop compartment',
    image: 'https://via.placeholder.com/200x200?text=Backpack',
    category: 'Accessories'
  },
  {
    id: 6,
    name: 'Desk Chair',
    price: 299.99,
    description: 'Ergonomic office chair with lumbar support',
    image: 'https://via.placeholder.com/200x200?text=Desk+Chair',
    category: 'Furniture'
  }
];

// In-memory cart storage (in production, use a database)
const carts = {};

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get cart
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json(carts[userId] || []);
});

// Add to cart
app.post('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  const existingItem = carts[userId].find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({ product, quantity });
  }
  
  res.json(carts[userId]);
});

// Update cart item
app.put('/api/cart/:userId/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const item = carts[userId].find(item => item.product.id === productId);
  if (item) {
    if (quantity <= 0) {
      carts[userId] = carts[userId].filter(item => item.product.id !== productId);
    } else {
      item.quantity = quantity;
    }
    res.json(carts[userId]);
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

// Remove from cart
app.delete('/api/cart/:userId/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);
  
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  carts[userId] = carts[userId].filter(item => item.product.id !== productId);
  res.json(carts[userId]);
});

// Clear cart
app.delete('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  carts[userId] = [];
  res.json({ message: 'Cart cleared' });
});

// Checkout (simplified)
app.post('/api/checkout/:userId', (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || [];
  
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Clear cart after checkout
  carts[userId] = [];
  
  res.json({
    success: true,
    message: 'Order placed successfully',
    orderId: Math.random().toString(36).substr(2, 9),
    total: total.toFixed(2)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`E-commerce server running on port ${PORT}`);
});
