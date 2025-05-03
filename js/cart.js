<<<<<<< Updated upstream
// ------------------------------- Cart-Slider functions start
let cartItems = [];

// Helper function to get current user ID (returns number for logged-in users)
function getCurrentUserId() {
  const userId = sessionStorage.getItem('userLoggedIn');
  return userId ? (userId.id) : 'guest';
}

// Helper function to get the full data object from localStorage
function getAppData() {
  const storedData = localStorage.getItem('data');
  return storedData ? JSON.parse(storedData) : { users: [], products: [], orders: [], cart: [] };
}

// Helper function to save the current cart with proper structure
function saveCurrentCart() {
  const data = getAppData();
  const userId = getCurrentUserId();
  
  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  // Find existing cart for user or create new one
  let userCart = data.cart.find(c => c.userId === userId);
  
  if (userCart) {
    userCart.products = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));
    userCart.totalAmount = totalAmount;
  } else {
    data.cart.push({
      userId: userId,
      products: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      totalAmount: totalAmount
    });
  }
  
  localStorage.setItem('data', JSON.stringify(data));
}

// Initialize cart - converts stored format to working format
function initCart() {
  const data = getAppData();
  const userId = getCurrentUserId();
  
  const userCart = data.cart.find(c => c.userId === userId);
  
  if (userCart && Array.isArray(userCart.products)) {
    // Convert stored cart format to our working format
    cartItems = userCart.products.map(item => {
      const product = data.products.find(p => p.id === item.productId);
      return product ? {
        id: product.id,
        userId: userId,
        name: product.name || 'Unknown Product',
        price: typeof product.price === 'number' ? product.price : 0,
        image: product.image || '',
        stock: typeof product.stock === 'number' ? product.stock : 50,
        quantity: typeof item.quantity === 'number' ? item.quantity : 1
      } : null;
    }).filter(item => item !== null);
  } else {
    cartItems = [];
  }
  
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    cartElement.textContent = totalItems;
  }
}

function toggleCart() {
  const cartSlider = document.getElementById("cartSlider");
  const overlay = document.getElementById("overlay");

  if (!cartSlider || !overlay) return;

  if (cartSlider.classList.contains("show")) {
    cartSlider.classList.remove("show");
    overlay.classList.remove("show");
    document.removeEventListener("click", handleOutsideClick);
  } else {
    cartSlider.classList.add("show");
    overlay.classList.add("show");
    renderCartItems();

    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  }
}

function handleOutsideClick(event) {
  const cartSlider = document.getElementById("cartSlider");
  const overlay = document.getElementById("overlay");
  
  if (!cartSlider || !overlay) return;
  
  const isClickInsideCart = event.target.closest('#cartSlider') || 
                          event.target.closest('.btn-outline-secondary') || 
                          event.target.closest('.btn-danger');
  
  if (!isClickInsideCart) {
    cartSlider.classList.remove("show");
    overlay.classList.remove("show");
    document.removeEventListener("click", handleOutsideClick);
  }
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");
  
  if (!cartItemsContainer || !cartTotalElement) return;
  
  cartItemsContainer.innerHTML = '';

  if (!Array.isArray(cartItems)) {
    cartItems = [];
=======
// ------------------------------- Cart Module -------------------------------
class CartManager {
  constructor() {
    this.cartItems = [];
    this.init();
>>>>>>> Stashed changes
  }

  // Initialize cart and event listeners
  init() {
    this.loadCart();
    this.setupEventListeners();
    this.injectStyles();
  }

  // Load cart from localStorage
  loadCart() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.cartItems = [];
      this.updateCartCount();
      return;
    }

    const data = this.getAppData();
    const userCart = data.cart.find(c => c.userId === userId);
    
    if (userCart && Array.isArray(userCart.products)) {
      this.cartItems = userCart.products.map(product => {
        const fullProduct = data.products.find(p => p.id === product.productId) || {};
        return {
          id: product.productId,
          userId: userId,
          name: fullProduct.name || 'Unknown Product',
          price: parseFloat(fullProduct.price) || 0,
          image: fullProduct.image || '',
          stock: parseInt(fullProduct.stock) || 50,
          quantity: parseInt(product.quantity) || 1
        };
      });
    } else {
      this.cartItems = [];
    }
    
    this.updateCartCount();
  }

  // Save cart to localStorage
  saveCart() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.warn('Cannot save cart - no user ID');
      return;
    }

    const data = this.getAppData();
    const userCartIndex = data.cart.findIndex(c => c.userId === userId);
    
    const products = this.cartItems.map(item => ({
      productId: parseInt(item.id),
      quantity: parseInt(item.quantity)
    }));

    const totalAmount = this.calculateTotal();

    if (userCartIndex !== -1) {
      data.cart[userCartIndex] = {
        userId: userId,
        products: products,
        totalAmount: totalAmount
      };
    } else {
      data.cart.push({
        userId: userId,
        products: products,
        totalAmount: totalAmount
      });
    }
    
    try {
      localStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Calculate total cart value
  calculateTotal() {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Update cart count display
  updateCartCount() {
    const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartElement = document.getElementById("cart");
    if (cartElement) {
      cartElement.textContent = totalItems;
    }
  }

  // Toggle cart visibility
  toggleCart() {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");

    if (!cartSlider || !overlay) return;

    if (cartSlider.classList.contains("show")) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");
    
    cartSlider.classList.add("show");
    overlay.classList.add("show");
    this.renderCartItems();

    setTimeout(() => {
      document.addEventListener("click", this.handleOutsideClick.bind(this));
    }, 0);
  }

  closeCart() {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");
    
    cartSlider.classList.remove("show");
    overlay.classList.remove("show");
    document.removeEventListener("click", this.handleOutsideClick.bind(this));
  }

  // Handle clicks outside cart
  handleOutsideClick(event) {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");
    
    if (!cartSlider || !overlay) return;
    
    const isClickInsideCart = event.target.closest('#cartSlider') || 
                            event.target.closest('.btn-outline-secondary') || 
                            event.target.closest('.btn-danger');
    
    if (!isClickInsideCart) {
      this.closeCart();
    }
  }

  // Render cart items to DOM
  renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = '';

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
      cartTotalElement.textContent = '$0.00';
      return;
    }

    this.cartItems.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";
      cartItem.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width: 55px; height: 75px; object-fit: cover;">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="mb-1">$${item.price.toFixed(2)}</p>
            <small class="text-muted d-block">Max: ${item.stock}</small>
            <div class="input-group input-group-sm" style="width: 120px;">
              <button class="btn btn-outline-secondary" 
                      data-action="decrease" data-index="${index}"
                      ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
              <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
              <button class="btn btn-outline-secondary" 
                      data-action="increase" data-index="${index}"
                      ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
            </div>
          </div>
        </div>
        <button class="btn btn-danger btn-sm" data-action="remove" data-index="${index}">
          <i class="bi bi-trash"></i>
        </button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `$${this.calculateTotal().toFixed(2)}`;
  }

  // Add product to cart
  addToCart(product, quantity = 1) {
    if (!product || typeof product.id === 'undefined') {
      console.error('Invalid product data');
      return;
    }

    const userId = this.getCurrentUserId();
    if (!userId) {
      this.showMessage('Please log in to add items to cart');
      return;
    }

    const availableStock = parseInt(product.stock) || 50;
    const safeQuantity = Math.max(1, Math.min(quantity, availableStock));
    
    const existingItem = this.cartItems.find(item => item.id === product.id && item.userId === userId);
    
    if (existingItem) {
      const requestedQty = existingItem.quantity + safeQuantity;
      if (requestedQty > availableStock) {
        this.showMessage(`Only ${availableStock} available in stock`);
        return;
      }
      existingItem.quantity = requestedQty;
    } else {
      this.cartItems.push({
        id: product.id,
        userId: userId,
        name: product.name || 'Unknown Product',
        price: parseFloat(product.price) || 0,
        image: product.image || '',
        stock: availableStock,
        quantity: safeQuantity
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.showMessage(`${safeQuantity} ${product.name || 'item'} added to cart`);

    const cartSlider = document.getElementById("cartSlider");
    if (cartSlider && !cartSlider.classList.contains("show")) {
      this.openCart();
    }
  }

  // Update product quantity
  updateQuantity(index, change) {
    if (index < 0 || index >= this.cartItems.length) return;

    const item = this.cartItems[index];
    const newQuantity = item.quantity + change;

    if (change > 0 && newQuantity > item.stock) {
      this.showMessage(`Only ${item.stock} available in stock`);
      return;
    }

    if (newQuantity < 1) {
      this.removeFromCart(index);
      return;
    }

    item.quantity = newQuantity;
    this.saveCart();
    this.renderCartItems();
    this.updateCartCount();
  }

  // Remove product from cart
  removeFromCart(index) {
    if (index < 0 || index >= this.cartItems.length) return;

    const item = this.cartItems[index];
    const itemName = item.name || 'item';
    
    this.showMessage(`${itemName} removed from cart`);
    
    const cartItemElements = document.querySelectorAll('#cartItems > div');
    if (cartItemElements[index]) {
      cartItemElements[index].classList.add('removing');
      setTimeout(() => {
        this.cartItems.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
      }, 300);
    }
  }

  // Show flash message
  showMessage(message) {
    const existingMessages = document.querySelectorAll('.warning-message');
    existingMessages.forEach(msg => msg.remove());

    if (!message) return;

    const warning = document.createElement('div');
    warning.className = 'warning-message';
    warning.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
      ${message}
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => {
      warning.remove();
    }, 2300);
  }

  // Helper functions
  getCurrentUserId() {
    try {
      const userData = sessionStorage.getItem('userLoggedIn');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return user?.id ? parseInt(user.id) : null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  getAppData() {
    try {
      const storedData = localStorage.getItem('data');
      return storedData ? JSON.parse(storedData) : { users: [], products: [], orders: [], cart: [] };
    } catch (error) {
      console.error('Error reading app data:', error);
      return { users: [], products: [], orders: [], cart: [] };
    }
  }

  // Setup event listeners
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      // Delegate cart item actions
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.getAttribute('data-action');
        const index = parseInt(target.getAttribute('data-index'));
        
        switch (action) {
          case 'increase':
            this.updateQuantity(index, 1);
            break;
          case 'decrease':
            this.updateQuantity(index, -1);
            break;
          case 'remove':
            this.removeFromCart(index);
            break;
        }
      });

      // Handle storage changes
      window.addEventListener('storage', (e) => {
        if (e.key === 'userLoggedIn') {
          this.loadCart();
          this.renderCartItems();
        }
      });
    });
  }

  // Inject required styles
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .warning-message {
        position: fixed;
        top: 70px;
        right: 20px;
        background-color: #202529;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        z-index: 1200;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
        border-left: 4px solid #ffc107;
        max-width: 300px;
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      .removing {
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize cart manager and expose necessary methods
const cart = new CartManager();
window.toggleCart = () => cart.toggleCart();
window.addToCart = (product, quantity) => cart.addToCart(product, quantity);
// ------------------------------- End of Cart Module -------------------------------