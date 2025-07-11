// scripts/success.js
import { getCurrentUser } from './user.js';

(async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(localStorage.getItem('lastTransaction'));
  if (!payload) {
    alert("No completed transaction data found.");
    window.location.href = "home.html";
    return;
  }

  // Populate transaction info
  document.querySelector(".status-message").textContent = 
    `Successfully purchased data subscription worth ₦${payload.amount}/${payload.plan_name} to ${payload.phone}`;

  const txId = payload.transaction_id || Math.floor(Math.random() * 1e12).toString();
  const now = new Date();
  const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
                  `, ${now.getDate()}${getOrdinal(now.getDate())}, ${now.getFullYear()}`;

  document.querySelector(".transaction-box .detail:nth-child(2) span:last-child").textContent = txId;
  document.querySelector(".transaction-box .detail:nth-child(3) span:last-child").textContent = dateStr;
  document.querySelector(".transaction-box .detail:nth-child(4) span:last-child").textContent = payload.phone;
  document.querySelector(".transaction-box .detail:nth-child(5) span:last-child").textContent = "Data Subscription";
  document.querySelector(".transaction-box .detail:nth-child(6) span:last-child").textContent = `₦${payload.amount}`;
  document.querySelector(".transaction-box .detail:nth-child(7) span:last-child").textContent = `${payload.plan_name}`;

  // Optional: clear the last transaction to avoid duplicate display
  localStorage.removeItem('lastTransaction');
})();

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
