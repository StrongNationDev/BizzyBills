// scripts/confirm.js
import { getCurrentUser } from './user.js';

(async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
  if (!payload) {
    alert("No pending transaction found.");
    window.location.href = "airtime.html";
    return;
  }

  const amountElements = document.querySelectorAll('#AmountToCharge');
  amountElements.forEach(el => el.textContent = `₦${payload.amount.toLocaleString()}`);

  document.getElementById('DestinationNumber').textContent = payload.phone;

  const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
  if (networkSpan) {
    networkSpan.innerHTML = `<img src="${payload.network_icon}" alt="${payload.network}" class="icon" /> ${payload.network}`;
  }

  // Confirm Payment button handler
  const confirmBtn = document.getElementById('paynow');
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // You can re-save it if needed
    localStorage.setItem('pendingTransaction', JSON.stringify(payload));
    window.location.href = 'pin.html';
  });
})();
