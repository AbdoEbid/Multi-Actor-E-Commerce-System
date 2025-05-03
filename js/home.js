
// ------------------------------Register/Login Start------------------------------
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js';

const users = StorageManager.LoadSection("users") || [];
const adminExists = users.some(user => user.id === 0 && user.role === "admin");

const modal = document.getElementById("registerModal");
const icon = document.getElementById("Register-Icon");
const closeBtn = document.getElementById("closePopup");

document.getElementById('toggleToLogin').onclick = function () {
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
};

document.getElementById('toggleToSignUp').onclick = function () {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
};

icon.onclick = () => modal.classList.remove('d-none');
closeBtn.onclick = () => modal.classList.add('d-none');

const eyeIcon = document.getElementById("eyeIcon");
const password = document.getElementById("password");
eyeIcon.onclick = () => {
    if (password.type == "password") {
        password.type = "text";
        eyeIcon.src = "./images/Others/eye-open.png";
    } else {
        password.type = "password";
        eyeIcon.src = "./images/Others/eye-close.png";
    }
};

const loginEyeIcon = document.getElementById("loginEyeIcon");
const loginPassword = document.getElementById("loginPassword");
loginEyeIcon.onclick = () => {
    if (loginPassword.type == "password") {
        loginPassword.type = "text";
        loginEyeIcon.src = "./images/Others/eye-open.png";
    } else {
        loginPassword.type = "password";
        loginEyeIcon.src = "./images/Others/eye-close.png";
    }
};

window.Save = function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim().toLowerCase();
    let password = document.getElementById("password").value;

    // Add New Users with Incremental IDs
    UserManager.AddUser(name, email, password);
}

window.Login = function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = StorageManager.LoadSection("users") || [];
    const LoginUser = users.find(user => user.email === email && user.password === password);

<<<<<<< Updated upstream
    if (LoginUser) {
        // Store user data for session management
        sessionStorage.setItem('userLoggedIn', JSON.stringify(LoginUser));
        // Store user ID for cart functionality
        sessionStorage.setItem('userId', LoginUser.id);
        sessionStorage.setItem('userRole', LoginUser.role);

=======
    const LoginUser = users.find(user => user.email === email);
    if (!LoginUser) {
        alert("Email does not exist. Please register first.");
    } else if (LoginUser.password !== password) {
        alert("Incorrect password. Please try again.");
    }
    else {
>>>>>>> Stashed changes
        switch (LoginUser.role) {
            case "customer":
                sessionStorage.setItem('userLoggedIn', JSON.stringify(LoginUser));
                location.reload();
                document.getElementById("Register-Icon").classList.add("d-none");
                const userDropdown = document.getElementById("userDropdown");
                if (userDropdown) {
                    userDropdown.classList.remove("d-none");
                }

                const modal = document.getElementById("registerModal");
                if (modal) {
                    modal.classList.add("d-none");
                }
                document.getElementById("homeContent");
                break;
            case "admin":
                window.location.href = "admin-panel.html";
                break;
            case "seller":
                window.location.href = "seller-dashboard.html";
                break;
            default:
                alert("Invalid role. Please try again.");
        }
    } else {
        alert("Invalid email or password. Please try again.");
    }
};
// ------------------------------Register/Login End------------------------------

<<<<<<< Updated upstream
window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));

    // Set up UI based on login status
    if (loggedInUser) {
        document.getElementById("Register-Icon")?.classList.add("d-none");
        document.getElementById("userDropdown")?.classList.remove("d-none");
        
        // Ensure cart has the correct user ID even after page refresh
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', loggedInUser.id);
            sessionStorage.setItem('userRole', loggedInUser.role);
        }
    } else {
        document.getElementById("Register-Icon")?.classList.remove("d-none");
        document.getElementById("userDropdown")?.classList.add("d-none");
        
        // Set guest ID for cart if no user is logged in
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', 'guest');
        }
    }
});

document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Clear all user session data
=======
document.getElementById("logout")?.addEventListener("click", () => {
>>>>>>> Stashed changes
    sessionStorage.removeItem("userLoggedIn");
    location.reload();
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// Initialize cart for current user
document.addEventListener('DOMContentLoaded', function() {
    // Ensure cart has a user ID (logged in or guest)
    if (!sessionStorage.getItem('userId')) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));
        sessionStorage.setItem('userId', loggedInUser ? loggedInUser.id : 'guest');
    }
});
=======

=======
>>>>>>> Stashed changes
function CreateFeaturedProducts(products) {
    if (!products || !Array.isArray(products) || products.length === 0) {
        console.error("No products available or invalid products data");
        return;
    }

    const content = document.getElementById("content");
    if (!content) return;

    // Clear existing content
    content.innerHTML = '';

    // Create a copy of products array to avoid modifying the original
    const availableProducts = [...products];
    
    // Determine how many products to show (up to 9 or available products count)
    const productCount = Math.min(9, availableProducts.length);
    
    // Create a set to track used indices to avoid duplicates
    const usedIndices = new Set();

    for (let i = 0; i < productCount; i++) {
        let randomIndex;
        do {
            randomIndex = getRandomValues(0, availableProducts.length - 1);
        } while (usedIndices.has(randomIndex) && usedIndices.size < availableProducts.length);
        
        usedIndices.add(randomIndex);
        const product = availableProducts[randomIndex];

        if (!product) continue;

        const card = `
        <div class="col-12 col-sm-6 col-lg-3 mb-4">
          <div class="card h-100 position-relative text-center p-3">
            <!-- Buttons for heart and eye icons -->
            <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
              <button class="btn btn-light rounded-circle shadow-sm">
                <i class="bi bi-heart"></i>
              </button>
              <a href="product-details.html?id=${product.id || ''}" class="text-decoration-none">
                <button class="btn btn-light rounded-circle shadow-sm">
                  <i class="bi bi-eye"></i>
                </button>
              </a>
            </div>
            
            <a href="product-details.html?id=${product.id || ''}" class="text-decoration-none">
              <img src="${product.image || ''}" class="card-img-top mx-auto" style="max-width: 60%; height:200px" alt="${product.name || ''}">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title fw-semibold mb-2">${product.name || 'No name'}</h5>
                <p class="text-muted small">${product.description || 'No description'}</p>
              </div>
            </a>

            <!-- Card Footer with Price and Add to Cart Button -->
            <div class="card-footer bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">$${product.price || '0.00'}</span>
                <button class="btn btn-outline-dark btn-sm text-body-emphasis p-2 fw-semibold" 
                        onclick="addToCart({
                          id: ${product.id || 0}, 
                          name: '${product.name || ''}', 
                          price: ${product.price || 0}, 
                          image: '${product.image || ''}'
                        })">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
        `;
        content.innerHTML += card;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));

    if (loggedInUser && loggedInUser.role === 'customer') {
        document.getElementById("Register-Icon")?.classList.add("d-none");
        document.getElementById("userDropdown")?.classList.remove("d-none");
    } else {
        document.getElementById("Register-Icon")?.classList.remove("d-none");
        document.getElementById("userDropdown")?.classList.add("d-none");
    }
<<<<<<< Updated upstream
    CreateFeaturedProducts(StorageManager.LoadSection("products"));
});
>>>>>>> Stashed changes
=======

    const products = StorageManager.LoadSection("products") || [];
    CreateFeaturedProducts(products);
});
>>>>>>> Stashed changes
