import { getCurrentUser } from './user.js'; // make sure path is correct

emailjs.init("MrW-NEmG--UIlGYKS");  // your public key

let currentUser = null;

// Get current user info on page load
(async () => {
  currentUser = await getCurrentUser();
  console.log("Current User:", currentUser); // for debugging, remove in production
})();

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Ensure we have current user data (in case it wasn't loaded yet)
  if (!currentUser) {
    currentUser = await getCurrentUser();
  }

  // Prepare hidden user info
  const userInfo = currentUser ? `
  User Info:
  - Username: ${currentUser.username || "N/A"}
  - Email: ${currentUser.email || "N/A"}
  - Phone: ${currentUser.phone_number || "N/A"}
  - Wallet Balance: ${currentUser.wallet_balance ?? "N/A"}
  ` : "User not logged in.";

  // Prepare template parameters
  const templateParams = {
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    message: `${document.getElementById('message').value}\n\n${userInfo}`
  };

  // Send email
  emailjs.send("service_qgcygqo", "template_xr7md0a", templateParams)
    .then(function(response) {
      alert("✅ Message sent successfully!");
      document.getElementById('contactForm').reset();
    }, function(error) {
      alert("❌ Failed to send message. Please try again.");
      console.error("EmailJS Error:", error);
    });
});






// emailjs.init("MrW-NEmG--UIlGYKS");  // your public key

// document.getElementById('contactForm').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const templateParams = {
//     from_name: document.getElementById('name').value,
//     from_email: document.getElementById('email').value,
//     message: document.getElementById('message').value
//   };

//   emailjs.send("service_qgcygqo", "template_xr7md0a", templateParams)
//     .then(function(response) {
//       alert("✅ Message sent successfully!");
//       document.getElementById('contactForm').reset();
//     }, function(error) {
//       alert("❌ Failed to send message. Please try again.");
//       console.error("EmailJS Error:", error);
//     });
// });
