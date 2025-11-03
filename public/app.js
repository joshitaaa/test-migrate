// API Base URL
const API_URL = window.location.origin;
const USER_ID = 'user-' + Math.random().toString(36).substr(2, 9); // Simple user ID for demo

// State
let products = [];
let cart = [];
let currentView = 'products';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('viewCart').addEventListener('click', showCart);
    document.getElementById('backToProducts').addEventListener('click', showProducts);
    document.getElementById('clearCart').addEventListener('click', clearCart);
    document.getElementById('checkout').addEventListener('click', showCheckout);
    document.getElementById('backToCart').addEventListener('click', showCart);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        products = await response.json();
        renderProducts();
    } catch (error) {
        showNotification('Error loading products', 'error');
        console.error('Error:', error);
    }
}

// Render products
function renderProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <span class="category">${product.category}</span>
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <input type="number" id="qty-${product.id}" value="1" min="1" max="99">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Add to cart
async function addToCart(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value);
    
    try {
        const response = await fetch(`${API_URL}/api/cart/${USER_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        cart = await response.json();
        updateCartCount();
        showNotification('Product added to cart!', 'success');
        quantityInput.value = 1;
    } catch (error) {
        showNotification('Error adding to cart', 'error');
        console.error('Error:', error);
    }
}

// Load cart
async function loadCart() {
    try {
        const response = await fetch(`${API_URL}/api/cart/${USER_ID}`);
        cart = await response.json();
        updateCartCount();
    } catch (error) {
        showNotification('Error loading cart', 'error');
        console.error('Error:', error);
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Show cart
async function showCart() {
    await loadCart();
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('cartSection').style.display = 'block';
    document.getElementById('checkoutSection').style.display = 'none';
    currentView = 'cart';
    renderCart();
}

// Show products
function showProducts() {
    document.getElementById('productsSection').style.display = 'block';
    document.getElementById('cartSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'none';
    currentView = 'products';
}

// Show checkout
function showCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('cartSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
    currentView = 'checkout';
    renderCheckoutTotal();
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="showProducts()">Continue Shopping</button>
            </div>
        `;
        cartTotal.innerHTML = '';
        document.getElementById('cartActions').style.display = 'none';
        return;
    }
    
    document.getElementById('cartActions').style.display = 'flex';
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="cart-item-details">
                <h3>${item.product.name}</h3>
                <div class="price">$${item.product.price.toFixed(2)}</div>
                <p>${item.product.description}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                </div>
                <div>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
                <button class="btn btn-danger" onclick="removeFromCart(${item.product.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.innerHTML = `
        <h3>Cart Total</h3>
        <div class="total-amount">$${total.toFixed(2)}</div>
    `;
}

// Update quantity
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/cart/${USER_ID}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        cart = await response.json();
        updateCartCount();
        renderCart();
    } catch (error) {
        showNotification('Error updating quantity', 'error');
        console.error('Error:', error);
    }
}

// Remove from cart
async function removeFromCart(productId) {
    try {
        const response = await fetch(`${API_URL}/api/cart/${USER_ID}/${productId}`, {
            method: 'DELETE'
        });
        
        cart = await response.json();
        updateCartCount();
        renderCart();
        showNotification('Item removed from cart', 'success');
    } catch (error) {
        showNotification('Error removing item', 'error');
        console.error('Error:', error);
    }
}

// Clear cart
async function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/cart/${USER_ID}`, {
            method: 'DELETE'
        });
        
        cart = [];
        updateCartCount();
        renderCart();
        showNotification('Cart cleared', 'success');
    } catch (error) {
        showNotification('Error clearing cart', 'error');
        console.error('Error:', error);
    }
}

// Render checkout total
function renderCheckoutTotal() {
    const checkoutTotal = document.getElementById('checkoutTotal');
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    checkoutTotal.innerHTML = `
        <h3>Order Total</h3>
        <div class="total-amount">$${total.toFixed(2)}</div>
    `;
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zipCode').value
    };
    
    try {
        const response = await fetch(`${API_URL}/api/checkout/${USER_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
            cart = [];
            updateCartCount();
            document.getElementById('checkoutForm').reset();
            
            // Show success message
            const checkoutSection = document.getElementById('checkoutSection');
            checkoutSection.innerHTML = `
                <div class="checkout-success" style="text-align: center; padding: 3rem;">
                    <h2 style="color: #27ae60; margin-bottom: 1rem;">✓ Order Placed Successfully!</h2>
                    <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">Order ID: <strong>${result.orderId}</strong></p>
                    <p style="font-size: 1.25rem; margin-bottom: 2rem;">Total: <strong>$${result.total}</strong></p>
                    <p style="color: #7f8c8d; margin-bottom: 2rem;">Thank you for your order! You will receive a confirmation email shortly.</p>
                    <button class="btn btn-primary" onclick="showProducts()">Continue Shopping</button>
                </div>
            `;
        } else {
            showNotification('Error placing order', 'error');
        }
    } catch (error) {
        showNotification('Error processing checkout', 'error');
        console.error('Error:', error);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// Initialize cart count on load
loadCart();
