import { getCurrentUser } from './user.js';

(async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
  if (!payload || payload.type !== 'data') {
    alert("No pending data transaction found.");
    window.location.href = "data.html";
    return;
  }

  const { amount, phone, network, network_icon, plan_label } = payload;

  // Extract values from plan label
  const qualityMatch = plan_label.match(/^(.+?)\s*-\s*₦/); // e.g. "10GB - ₦3500"
  const periodMatch = plan_label.match(/\(([^)]+)\)/);      // e.g. "(30 days)"

  const dataQuality = qualityMatch ? qualityMatch[1] : '';
  const dataPeriod = periodMatch ? periodMatch[1] : '';

  // Set amount display
  const amountDisplay = `₦${amount.toLocaleString()} - ${plan_label}`;
  document.querySelectorAll('#AmountToCharge').forEach(el => el.textContent = amountDisplay);

  // Set destination number
  document.getElementById('DestinationNumber').textContent = phone;

  // Set network
  const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
  if (networkSpan) {
    networkSpan.innerHTML = `<img src="${network_icon}" alt="${network}" class="icon"> ${network}`;
  }

  // Set product type
  const productSpan = document.querySelector('.payment-details .detail:nth-child(2) span:last-child');
  if (productSpan) productSpan.textContent = "Data Subscription";

  // Set quality and period
  const qualityEl = document.getElementById('DataQuality');
  if (qualityEl) qualityEl.textContent = dataQuality;

  const periodEl = document.getElementById('DataPeriod');
  if (periodEl) periodEl.textContent = dataPeriod;
})();

// // 🟢 Navigate to datapin.html on click
// document.getElementById('paynow')?.addEventListener('click', () => {
//   window.location.href = 'datapin.html';
// });

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById('paynow');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      window.location.href = 'datapin.html';
    });
  }
});
