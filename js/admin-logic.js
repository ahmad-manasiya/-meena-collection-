// 1. Navigation Logic
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    if (sectionId === 'listed-product-sec') loadListedProducts();
    if (sectionId === 'orders-sec') loadAdminOrders();
    if (sectionId === 'dashboard-sec') updateDashboardStats();
}

// 2. Product Upload
async function uploadProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const photoInput = document.getElementById('pPhoto');

    if (!name || !price || photoInput.files.length === 0) {
        alert("Zaroori: Naam, Price aur Photo teeno chahiye!");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', photoInput.files[0]);
    formData.append('description', "Admin Upload");

    try {
        const response = await fetch('http://localhost:5000/api/products/upload', {
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            alert("Success! Product photo ke saath save ho gaya ✅");
            document.getElementById('pName').value = "";
            document.getElementById('pPrice').value = "";
            photoInput.value = "";
            showSection('listed-product-sec'); 
        }
    } catch (err) {
        alert("Server error: Product upload nahi hua.");
    }
}

// 3. Manage Orders Load (YAHAN CHANGES KIYE HAIN)
async function loadAdminOrders() {
    const orderTableBody = document.getElementById('adminOrdersBody');
    if (!orderTableBody) return;

    orderTableBody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Loading orders...</td></tr>";

    try {
        const response = await fetch('http://localhost:5000/api/orders');
        const orders = await response.json();

        if (orders.length === 0) {
            orderTableBody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Koi orders nahi mile.</td></tr>";
            return;
        }

        // Terminal data ke mutabiq keys set ki hain
        orderTableBody.innerHTML = orders.map(o => `
            <tr>
                <td>${o.orderDate || 'N/A'}</td>
                
                <td><b>${o.customerName || 'Guest'}</b></td>
                
                <td style="max-width:200px; font-size:12px;">${o.address || 'N/A'}</td> 
                
                <td>${o.productName}</td>
                <td>₹${o.price}</td>
                <td>
                    <span class="status-badge status-${(o.status || 'pending').toLowerCase()}">
                        ${o.status || 'Pending'}
                    </span>
                </td>
                <td>
                    <select onchange="updateOrderStatus('${o._id}', this.value)" style="padding:5px; border-radius:4px;">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteOrder('${o._id}')" style="background:none; border:none; color:#d11a2a; cursor:pointer; font-size:18px;">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join(''); // .reverse() hataya kyunki backend pehle se sorted de raha hai
        
        updateDashboardStats(orders);
    } catch (err) {
        console.error("Order fetch error:", err);
        orderTableBody.innerHTML = "<tr><td colspan='8' style='text-align:center; color:red;'>Server Error! Check Console.</td></tr>";
    }
}

// 4. Delete Order
async function deleteOrder(orderId) {
    if (!orderId) return;
    if (confirm("Kya aap is Order ko hamesha ke liye delete karna chahte hain?")) {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Order Deleted! 🗑️");
                loadAdminOrders();
            }
        } catch (err) {
            alert("Connection error: Order delete nahi hua.");
        }
    }
}

// 5. Status Update
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if(response.ok) {
            alert(`Status updated to ${newStatus} ✅`);
            loadAdminOrders(); 
        }
    } catch (err) {
        alert("Failed to update status.");
    }
}

// 6. Dashboard Stats
async function updateDashboardStats(ordersData) {
    try {
        let orders = ordersData;
        if (!orders) {
            const response = await fetch('http://localhost:5000/api/orders');
            orders = await response.json();
        }

        const totalOrders = orders.length;
        const totalSales = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

        if(document.getElementById('totalOrders')) document.getElementById('totalOrders').innerText = totalOrders;
        if(document.getElementById('totalSales')) document.getElementById('totalSales').innerText = "₹" + totalSales;
    } catch (err) {
        console.log("Stats error");
    }
}

// 7. Listed Products Load
async function loadListedProducts() {
    const tableBody = document.getElementById('listedProductsBody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        if(document.getElementById('totalProds')) {
            document.getElementById('totalProds').innerText = products.length;
        }

        tableBody.innerHTML = products.map(p => `
            <tr>
                <td><img src="http://localhost:5000/uploads/${p.imageUrl || 'default.png'}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td>
                    <button onclick="deleteProduct('${p._id}')" style="background:#d11a2a; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Load error:", err);
    }
}

// Initial Load
window.onload = () => {
    loadAdminOrders();
    loadListedProducts();
};