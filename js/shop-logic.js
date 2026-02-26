// Global Variables
let allProducts = [];
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const API_BASE_URL = 'http://localhost:5000/api';

// Page load hone par functions run honge
window.addEventListener('DOMContentLoaded', () => {
    console.log("Meena Collection: Initializing...");
    checkUserLogin();
    loadProducts();
    updateCartCount();
});

// 1. Backend se Products Load karna
async function loadProducts() {
    const grid = document.getElementById('productGrid');
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error("Server error");
        
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("Fetch Error:", error);
        if(grid) {
            grid.innerHTML = `<p style="color:red; text-align:center; width:100%; font-weight:bold; padding: 50px;">
                Backend server (node server.js) band hai! <br> Please start the server.
            </p>`;
        }
    }
}

// 2. Products ko Grid mein Display karna
function displayProducts(list) {
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    
    grid.innerHTML = ""; 
    if (list.length === 0) {
        grid.innerHTML = `<p style="text-align:center; width:100%; padding: 50px;">Koi product nahi mila!</p>`;
        return;
    }

    list.forEach(p => {
        let imgPath = p.imageUrl || 'saree1.png';
        if(!imgPath.startsWith('http')) {
            imgPath = `images/${imgPath}`;
        }

        grid.innerHTML += `
            <div class="product-card" style="background:white; border:1px solid #f0f0f0; padding:15px; text-align:center; border-radius:4px;">
                <div style="height:200px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                    <img src="${imgPath}" alt="${p.name}" style="max-width:100%; max-height:100%; object-fit:contain;" 
                         onerror="this.src='images/saree1.png'">
                </div>
                <div class="product-name" style="font-size:14px; margin-top:10px; height:35px; overflow:hidden; font-weight:500; color:#212121;">${p.name}</div>
                <div class="price-box" style="font-weight:bold; font-size:18px; margin:8px 0; color:#388e3c;">
                    ₹${p.price}
                </div>
                <div style="display:flex; gap:8px; flex-direction:column;">
                    <button onclick="addToCart('${p.name}', ${p.price}, '${imgPath}')" 
                            style="background:#ff9f00; color:white; border:none; padding:10px; font-weight:bold; cursor:pointer; border-radius:2px;">
                        ADD TO CART
                    </button>
                    <button onclick="buyNow('${p.name}', ${p.price})" 
                            style="background:#fb641b; color:white; border:none; padding:10px; font-weight:bold; cursor:pointer; border-radius:2px;">
                        BUY NOW
                    </button>
                </div>
            </div>`;
    });
}

// 3. Buy Now Logic
// Buy Now: Alert ke bajaye Checkout page par bhejne ke liye
function buyNow(name, price) {
    const user = localStorage.getItem('userName');

    // 1. Check user login
    if (!user) {
        alert("Pehle Login karein!");
        window.location.href = "login.html";
        return;
    }

    // 2. Product details ko temporary save karein taaki checkout page use padh sake
    const checkoutItem = {
        name: name,
        price: price,
        date: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('pendingCheckout', JSON.stringify(checkoutItem));

    // 3. Seedha Checkout page par bhejein
    window.location.href = 'checkout.html';
}
// 4. Menu Toggle Function (FIXED: One function for all menus)
function toggleMenu(id) {
    const menu = document.getElementById(id);
    if (menu) {
        const isVisible = menu.style.display === 'block';
        // Sabhi menus ko band karein
        document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
        // Sirf target menu ko toggle karein
        menu.style.display = isVisible ? 'none' : 'block';
    }
}

// 5. Login Check
function checkUserLogin() {
    const authSection = document.getElementById('authSection');
    const userName = localStorage.getItem('userName');

    if (userName && authSection) {
        authSection.innerHTML = `
            <div class="dropdown">
                <div onclick="toggleMenu('userMenu')" style="color:white; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:5px;">
                    Hi, ${userName} <i class="fa fa-chevron-down" style="font-size:10px;"></i>
                </div>
                <div id="userMenu" class="dropdown-content" style="display:none; position:absolute; top:35px; right:0; background:white; color:black; width:180px; box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:4px; z-index:1000;">
                    <p onclick="location.href='profile.html'" style="padding:12px; margin:0; border-bottom:1px solid #f0f0f0; cursor:pointer;"><i class="fa fa-user-circle"></i> My Profile</p>
                    <p onclick="location.href='orders.html'" style="padding:12px; margin:0; border-bottom:1px solid #f0f0f0; cursor:pointer;"><i class="fa fa-box"></i> My Orders</p>
                    <p onclick="logoutUser()" style="padding:12px; margin:0; color:red; cursor:pointer;"><i class="fa fa-sign-out-alt"></i> Logout</p>
                </div>
            </div>`;
    }
}

// 6. Cart & Other Utilities
function addToCart(name, price, img) {
    if (!localStorage.getItem('userName')) {
        alert("Pehle Login karein!");
        window.location.href = "login.html";
        return;
    }
    cartItems.push({name, price, img});
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    alert(name + " cart mein add ho gaya! 🛒");
}

function updateCartCount() {
    const countTag = document.getElementById('cartCount');
    if(countTag) countTag.innerText = cartItems.length;
}

function filterProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);
}

function logoutUser() {
    localStorage.clear();
    window.location.reload();
}



// Bahar click karne par menu band ho jaye
window.onclick = (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.more-btn')) {
        document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
    }
};