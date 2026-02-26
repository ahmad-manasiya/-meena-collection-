// Global Variables
let allProducts = [];
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// ⭐ Render Backend URL
const API_BASE_URL =
'https://meena-collection-ix8u.onrender.com/api';


// Page load
window.addEventListener('DOMContentLoaded', () => {

console.log("Meena Collection Live");

checkUserLogin();

loadProducts();

updateCartCount();

});


// 1 Load Products From Backend
async function loadProducts(){

const grid =
document.getElementById('productGrid');

try{

const response =
await fetch(`${API_BASE_URL}/products`);

if(!response.ok)
throw new Error("Server Error");

allProducts =
await response.json();

displayProducts(allProducts);

}

catch(error){

console.log(error);

if(grid){

grid.innerHTML=

`<p style="color:red;
text-align:center;
padding:50px;">

Products Load Failed

</p>`;

}

}

}



// 2 Display Products
function displayProducts(list){

const grid=
document.getElementById('productGrid');

if(!grid) return;

grid.innerHTML="";

if(!list.length){

grid.innerHTML=
"<p>No Product</p>";

return;

}

list.forEach(p=>{

// ⭐ Image Fix (Render Upload Folder)
let imgPath =

p.imageUrl ?

`https://meena-collection-ix8u.onrender.com/uploads/${p.imageUrl}`

:

'images/saree1.png';

grid.innerHTML +=`

<div class="product-card">

<img src="${imgPath}"

style="width:100%;
height:200px;
object-fit:contain;"

onerror="this.src='images/saree1.png'">

<div>${p.name}</div>

<div>₹${p.price}</div>

<button
onclick="addToCart('${p.name}',${p.price},
'${imgPath}')">

ADD TO CART

</button>

<button
onclick="buyNow('${p.name}',
${p.price})">

BUY NOW

</button>

</div>

`;

});

}



// Buy Now
function buyNow(name,price){

const user=
localStorage.getItem('userName');

if(!user){

alert("Login First");

window.location.href=
"login.html";

return;

}

localStorage.setItem(

'pendingCheckout',

JSON.stringify({

name,

price,

date:new Date()

})

);

window.location.href=
'checkout.html';

}



// Menu Toggle
function toggleMenu(id){

const menu=
document.getElementById(id);

if(menu){

const show=
menu.style.display==='block';

document

.querySelectorAll('.dropdown-content')

.forEach(d=>d.style.display='none');

menu.style.display=

show?'none':'block';

}

}



// Login Check
function checkUserLogin(){

const authSection=
document.getElementById('authSection');

const userName=
localStorage.getItem('userName');

if(userName && authSection){

authSection.innerHTML=

`Hi ${userName}`;

}

}



// Add Cart
function addToCart(name,price,img){

if(!localStorage

.getItem('userName')){

alert("Login First");

window.location.href=
"login.html";

return;

}

cartItems.push({name,price,img});

localStorage.setItem(

'cart',

JSON.stringify(cartItems)

);

updateCartCount();

alert("Added To Cart");

}



function updateCartCount(){

const tag=
document.getElementById('cartCount');

if(tag)

tag.innerText=
cartItems.length;

}



function filterProducts(){

const term=

document

.getElementById('searchInput')

.value.toLowerCase();

displayProducts(

allProducts.filter(p=>

p.name

.toLowerCase()

.includes(term)

)

);

}



function logoutUser(){

localStorage.clear();

location.reload();

}



window.onclick=(e)=>{

if(!e.target.closest('.dropdown')){

document

.querySelectorAll('.dropdown-content')

.forEach(d=>d.style.display='none');

}

};