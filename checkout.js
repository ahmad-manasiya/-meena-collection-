const BASE_URL ="https://meena-collection-ix8u.onrender.com";

async function placeOrder() {

const orderData = {

customerName:
document.getElementById('custName').value,

address:
document.getElementById('custAddress').value,

productName:"Premium Saree",

price:1000,

status:"Pending"

};

try{

const response =
await fetch(`${BASE_URL}/api/orders`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(orderData)

});

if(response.ok){

alert("Order Successful ✅");

window.location.href="account.html";

}

}catch(err){

alert("Order Failed Server Error");

}

}