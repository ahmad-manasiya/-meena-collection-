const STORAGE_KEY = 'meena_cart';

// --- 1. Login Check Karne Ka Function (Updated to check userName) ---
function isUserLoggedIn() {
    // login.html 'userName' save kar rahi hai, isliye hum wahi check karenge
    const user = localStorage.getItem('userName');
    console.log("Login Status (userName):", user); 
    return user !== null && user !== ""; 
}

// --- 2. Header ka Badge Update Karne Ke Liye ---
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const badges = document.querySelectorAll('.cart-count, .cart-badge, #cart-count, .cart_count');
    
    badges.forEach(badge => {
        const count = cart.length;
        badge.innerText = count;
        
        // Badge tabhi dikhao jab count 0 se zyada ho
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// --- 3. Product ko Cart mein Add karna (Fixed Mismatch) ---
function addToCart(productName, price, image) {
    // Pehle check karein login
    if (!isUserLoggedIn()) {
        alert("Pehle login karein, uske baad hi aap cart mein product add kar sakte hain! 🔒");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Naya product banayein
    const item = {
        id: Date.now(), 
        name: productName,
        price: parseInt(price),
        image: image
    };
    
    cart.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    
    alert(productName + " cart mein add ho gaya! ✅");
    
    updateCartBadge(); // 0 se 1, 2... karega
    
    // Agar Cart page par hain toh UI update karein
    if (document.getElementById('cartContent')) {
        renderCart();
    }
}

// --- 4. Cart Page Render (UI Update) ---
function renderCart() {
    const contentDiv = document.getElementById('cartContent');
    const titleElem = document.getElementById('cartTitle');
    const totalElem = document.getElementById('totalPrice');
    const finalElem = document.getElementById('finalAmount');
    
    updateCartBadge();

    if (!contentDiv) return; 

    let currentCart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let total = 0;

    if (titleElem) titleElem.innerText = `My Cart (${currentCart.length})`;

    if (currentCart.length === 0) {
        contentDiv.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <p style="font-size:18px; color:#666;">Aapka cart khali hai!</p>
                <a href="index.html" style="color:#2874f0; text-decoration:none; font-weight:bold;">Abhi Shopping Karein</a>
            </div>`;
        if (totalElem) totalElem.innerText = "₹0";
        if (finalElem) finalElem.innerText = "₹0";
        return;
    }

    contentDiv.innerHTML = "";
    currentCart.forEach((item) => {
        let price = parseInt(item.price) || 0;
        total += price;

        contentDiv.innerHTML += `
            <div class="item" style="display: flex; gap: 20px; border-bottom: 1px solid #eee; padding: 15px 0; align-items:center;">
                <img src="${item.image}" style="width: 80px; height: 80px; object-fit: contain;">
                <div style="flex-grow:1;">
                    <div style="font-size: 16px; font-weight: 600;">${item.name}</div>
                    <div style="font-weight: bold; margin-top: 5px; font-size: 18px; color: #388e3c;">₹${price}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" style="color: #ff4444; font-weight: bold; cursor: pointer; border: none; background: none; font-size: 13px; margin-top:5px;">REMOVE</button>
                </div>
            </div>`;
    });
    
    if (totalElem) totalElem.innerText = "₹" + total;
    if (finalElem) finalElem.innerText = "₹" + total;
}

// --- 5. Remove Function ---
function removeFromCart(id) {
    let currentCart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    currentCart = currentCart.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCart));
    renderCart(); 
}

// --- 6. Checkout Function ---
function goToCheckout() {
    const cartData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (cartData.length === 0) {
        alert("Aapka cart khali hai!");
        return;
    }

    const allProductNames = cartData.map(item => item.name).join(', ');
    const totalPrice = cartData.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);

    localStorage.setItem('pendingCheckout', JSON.stringify({
        name: allProductNames,
        price: totalPrice
    }));

    window.location.href = `checkout.html?name=${encodeURIComponent(allProductNames)}&price=${totalPrice}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cartContent')) {
        renderCart();
    }
});