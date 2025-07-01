import { getCurrentUser } from './user.js';

// PIN state
let enteredPin = '';
const pinBoxes = document.querySelectorAll('.pin-boxes div');
const buttons = document.querySelectorAll('.keypad button');
const loadingOverlay = document.getElementById('loading-overlay');

// Helper: update PIN boxes
function updatePinDisplay() {
  pinBoxes.forEach((box, index) => {
    box.textContent = enteredPin[index] || '';
  });
}

// Handle keypad input
buttons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.textContent.trim();

    if (value === '←') {
      enteredPin = enteredPin.slice(0, -1);
      updatePinDisplay();
    } else if (value === 'Enter') {
      // optional: manually trigger auth (already auto-triggers at 4 digits)
    } else if (enteredPin.length < 4 && /^\d$/.test(value)) {
      enteredPin += value;
      updatePinDisplay();

      if (enteredPin.length === 4) {
        // Show loader
        loadingOverlay.style.display = 'flex';

        // Authenticate pin
        const user = await getCurrentUser();
        if (!user) {
          alert("Session expired or user not found.");
          return (window.location.href = 'login.html');
        }

        if (user.pin === enteredPin) {
          // ✅ Correct pin
          console.log('PIN verified ✅');
          // You can redirect or trigger next action here
          window.localStorage.setItem('pin_verified', 'true');
          window.location.href = 'confirm.html'; // or any page you want
        } else {
          // ❌ Wrong pin
          alert('Incorrect PIN. Try again.');
          enteredPin = '';
          updatePinDisplay();
        }

        loadingOverlay.style.display = 'none';
      }
    }
  });
});
