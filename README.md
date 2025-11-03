# E-Commerce Shop

A basic e-commerce application built with Node.js, Express, and vanilla JavaScript.

## Features

- 📦 Product catalog with 6 sample products
- 🛒 Shopping cart functionality
- ➕ Add/remove items from cart
- 🔢 Adjust product quantities
- 💰 Real-time cart total calculation
- 📝 Checkout form with customer information
- ✅ Order confirmation
- 📱 Responsive design

## Technologies Used

### Backend
- Node.js
- Express.js
- CORS middleware
- Body-parser

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test-migrate
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId` - Add item to cart
  - Body: `{ productId: number, quantity: number }`
- `PUT /api/cart/:userId/:productId` - Update item quantity
  - Body: `{ quantity: number }`
- `DELETE /api/cart/:userId/:productId` - Remove item from cart
- `DELETE /api/cart/:userId` - Clear cart

### Checkout
- `POST /api/checkout/:userId` - Process checkout
  - Body: Customer information (name, email, address, etc.)

## Project Structure

```
test-migrate/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styles
│   └── app.js          # Frontend JavaScript
├── server.js           # Express server and API
├── package.json        # Project dependencies
└── README.md          # Documentation
```

## Usage

### Browsing Products
- View all available products on the home page
- Each product shows name, description, price, and category
- Use the quantity selector to choose how many items to add

### Managing Cart
- Click "Add to Cart" to add products
- Click the cart button in the header to view your cart
- Adjust quantities using +/- buttons
- Remove items with the "Remove" button
- Clear entire cart with "Clear Cart" button

### Checkout
- Click "Proceed to Checkout" from the cart
- Fill in shipping information
- Click "Place Order" to complete purchase
- View order confirmation with order ID

## Features in Detail

### Product Catalog
The app includes 6 sample products across different categories:
- Laptop ($999.99)
- Smartphone ($699.99)
- Headphones ($149.99)
- Coffee Maker ($79.99)
- Backpack ($49.99)
- Desk Chair ($299.99)

### Cart Management
- Persistent cart storage during session
- Real-time total calculation
- Quantity controls for each item
- Individual item removal
- Complete cart clearing

### Checkout Process
- Customer information collection
- Order total display
- Order confirmation with unique ID
- Cart automatically cleared after successful order

## Development

To run in development mode:
```bash
npm run dev
```

The server will start on port 3000 (or the PORT environment variable if set).

## Notes

- This is a basic implementation for demonstration purposes
- Cart data is stored in memory (resets on server restart)
- In production, you would want to:
  - Use a database for products and carts
  - Add authentication
  - Implement payment processing
  - Add inventory management
  - Include order history
  - Add search and filtering
  - Implement proper error handling
  - Add form validation
  - Include security measures

## License

ISC
