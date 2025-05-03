import StorageManager from "../modules/StorageModule.js";
import UserManager from "../modules/UserModule.js";

document.addEventListener("DOMContentLoaded", () => {
    const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    const userId = userLoggedIn?.id;

    if (userId) {
        // Check if this was a guest who just logged in
        const wasGuest = sessionStorage.getItem('userId') === 'guest';
        
        // Set the new user ID
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userLoggedIn', 'true');

        // Transfer guest cart to user if needed
        if (wasGuest) {
            transferGuestCartToUser(userId);
        }
        
        const users = StorageManager.LoadSection("users");
        const currentUser = users.find(user => user.id === userId);
        if (currentUser) {
            document.getElementById("profileName").value = currentUser.name || "";
            document.getElementById("profileEmail").value = currentUser.email || "";
            document.getElementById("profileStreet").value = currentUser.Address.street || "";
            document.getElementById("profileCity").value = currentUser.Address.city || "";
            document.getElementById("profileZip").value = currentUser.Address.zipCode || "";
            document.getElementById("profilePhone").value = currentUser.phone || "";
        }
    } else {
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', 'guest');
        }
    }

    window.updateProfile = function (event) {
        const name = document.getElementById("profileName").value.trim();
        const email = document.getElementById("profileEmail").value.trim();
        const street = document.getElementById("profileStreet").value.trim();
        const city = document.getElementById("profileCity").value.trim();
        const zipCode = document.getElementById("profileZip").value.trim();
        const phone = document.getElementById("profilePhone").value.trim();

        if (!userId) return alert("No user logged in");

        const updated = UserManager.UpdateUser(userId, name, email, street, city, zipCode, phone);

        if (updated) {
            alert("Profile updated successfully!");
        }
    };
});

function transferGuestCartToUser(userId) {
    const data = JSON.parse(localStorage.getItem('data') || '{}');
    const guestCart = data.cart?.find(c => c.userId === 'guest');
    
    if (guestCart) {
        // Find or create user cart
        let userCart = data.cart.find(c => c.userId === userId);
        
        if (userCart) {
            // Merge guest cart with existing user cart
            guestCart.products.forEach(guestItem => {
                const existingItem = userCart.products.find(userItem => 
                    userItem.productId === guestItem.productId);
                
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    userCart.products.push({
                        productId: guestItem.productId,
                        quantity: guestItem.quantity
                    });
                }
            });
        } else {
            // Create new user cart with guest items
            data.cart.push({
                userId: userId,
                products: [...guestCart.products],
                totalAmount: guestCart.totalAmount
            });
        }
        
        // Remove guest cart
        data.cart = data.cart.filter(c => c.userId !== 'guest');
        localStorage.setItem('data', JSON.stringify(data));
    }
}