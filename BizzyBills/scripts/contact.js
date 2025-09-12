// contact.js
  // Initialize EmailJS
  emailjs.init("MrW-NEmG--UIlGYKS");  // <-- Replace with your public key

  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Prepare template parameters
    const templateParams = {
      from_name: document.getElementById('name').value,
      from_email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    // Send email
    emailjs.send("service_qgcygqo", "template_xr7md0a", templateParams)
      .then(function(response) {
        alert("✅ Message sent successfully!");
        document.getElementById('contactForm').reset(); // clear form
      }, function(error) {
        alert("❌ Failed to send message. Please try again.");
        console.error("EmailJS Error:", error);
      });
  });