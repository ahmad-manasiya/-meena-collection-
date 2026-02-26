// ⭐ Backend Base URL (ek jagah change karo future me easy)
const BASE_URL ="https://meena-collection-ix8u.onrender.com";


// 1. Navigation Logic
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.classList.remove('active'));

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
        alert("Naam, Price aur Photo required!");
        return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', photoInput.files[0]);
    formData.append('description', "Admin Upload");

    try {

        const response = await fetch(`${BASE_URL}/api/products/upload`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {

            alert("Product Upload Success ✅");

            document.getElementById('pName').value = "";
            document.getElementById('pPrice').value = "";
            photoInput.value = "";

            showSection('listed-product-sec');
        }

    } catch (err) {

        alert("Server Error Upload Failed");

    }

}



// 3. Load Orders
async function loadAdminOrders() {

    const orderTableBody = document.getElementById('adminOrdersBody');

    if (!orderTableBody) return;

    orderTableBody.innerHTML =
        "<tr><td colspan='8'>Loading...</td></tr>";

    try {

        const response =
            await fetch(`${BASE_URL}/api/orders`);

        const orders = await response.json();

        if (!orders.length) {

            orderTableBody.innerHTML =
                "<tr><td colspan='8'>No Orders</td></tr>";

            return;
        }

        orderTableBody.innerHTML = orders.map(o => `

<tr>

<td>${o.orderDate || 'N/A'}</td>

<td><b>${o.customerName || 'Guest'}</b></td>

<td>${o.address || 'N/A'}</td>

<td>${o.productName}</td>

<td>₹${o.price}</td>

<td>

<span class="status-${(o.status || 'pending').toLowerCase()}">

${o.status || 'Pending'}

</span>

</td>

<td>

<select onchange="updateOrderStatus('${o._id}', this.value)">

<option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>

<option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>

<option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>

<option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>

</select>

</td>

<td>

<button onclick="deleteOrder('${o._id}')">

🗑️

</button>

</td>

</tr>

`).join('');

        updateDashboardStats(orders);

    }

    catch (err) {

        console.log(err);

    }

}



// 4 Delete Order
async function deleteOrder(orderId) {

    if (!confirm("Delete Order ?")) return;

    await fetch(`${BASE_URL}/api/orders/${orderId}`, {

        method: 'DELETE'

    });

    loadAdminOrders();

}



// 5 Update Status
async function updateOrderStatus(orderId, newStatus) {

    await fetch(`${BASE_URL}/api/orders/${orderId}`, {

        method: 'PUT',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            status: newStatus

        })

    });

    loadAdminOrders();

}



// 6 Dashboard
async function updateDashboardStats(ordersData) {

    let orders = ordersData;

    if (!orders) {

        const res = await fetch(`${BASE_URL}/api/orders`);

        orders = await res.json();

    }

    document.getElementById('totalOrders').innerText =
        orders.length;

    const totalSales = orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) =>
            sum + (Number(o.price) || 0), 0);

    document.getElementById('totalSales').innerText =
        "₹" + totalSales;

}



// 7 Load Products
async function loadListedProducts() {

    const tableBody =
        document.getElementById('listedProductsBody');

    if (!tableBody) return;

    const response =
        await fetch(`${BASE_URL}/api/products`);

    const products = await response.json();

    document.getElementById('totalProds').innerText =
        products.length;

    tableBody.innerHTML = products.map(p => `

<tr>

<td>

<img src="${BASE_URL}/uploads/${p.imageUrl}"

style="width:40px;height:40px;object-fit:cover;">

</td>

<td>${p.name}</td>

<td>₹${p.price}</td>

<td>

<button onclick="deleteProduct('${p._id}')">

Delete

</button>

</td>

</tr>

`).join('');

}



window.onload = () => {

    loadAdminOrders();

    loadListedProducts();

};