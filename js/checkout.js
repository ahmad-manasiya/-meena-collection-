function placeOrder() {
    const orderData = {
        customerName: document.getElementById('custName').value,
        address: document.getElementById('custAddress').value,
        productName: "Premium Saree", // Ye cart se aayega
        status: "Processing",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("orders").add(orderData).then(() => {
        alert("Order Successful! Meena Collection jald hi aapse sampark karega.");
        window.location.href = "account.html";
    });
}