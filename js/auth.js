// OTP Bhejne ka function
function sendOTP() {
    const mobileNumber = "+91" + document.getElementById('mobileInput').value;
    
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    auth.signInWithPhoneNumber(mobileNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("OTP Bheja gaya hai!");
            // OTP dalne wala box dikhayein
        }).catch((error) => {
            alert("Error: " + error.message);
        });
}

// OTP Verify karke Login karne ka function
function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        const adminNumber = "+919876543210"; // Owner ka number

        if (user.phoneNumber === adminNumber) {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "index.html";
        }
    }).catch((error) => {
        alert("Galat OTP!");
    });
}