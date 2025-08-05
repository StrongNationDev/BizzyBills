import { getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const receiptBox = document.querySelector('.transaction-box');
  const statusTitle = document.querySelector('.status-title');
  const statusMessage = document.querySelector('.status-message');
  const amountEl = document.querySelector('#AmountToCharge');
  const destinationEl = document.querySelectorAll('#DestinationNumber');
  const checkIcon = document.querySelector('.checkmark img');

  const selectedTx = localStorage.getItem('selectedReceipt');

  if (!selectedTx) {
    alert("No transaction selected.");
    window.location.href = 'home.html';
    return;
  }

  let tx;
  try {
    tx = JSON.parse(selectedTx);
  } catch (err) {
    console.error("Invalid transaction data in storage.");
    alert("Could not read transaction data.");
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    alert("Not logged in.");
    window.location.href = 'login.html';
    return;
  }

  const found = (user.history || []).find(t => t.id === tx.id);

  if (!found) {
    alert("Transaction not found in your history.");
    window.location.href = 'home.html';
    return;
  }

  // --- Format data ---
  const formattedDate = formatDate(found.time);
  const formattedAmount = `₦${Number(found.amount).toLocaleString()}`;
  const capitalizedType = formatTitle(found.type);
  const statusText = found.status?.toLowerCase() === 'successful'
    ? `${capitalizedType} Successful`
    : `${capitalizedType} Failed`;

  // --- Set Icon ---
  if (checkIcon) {
    checkIcon.src = found.status?.toLowerCase() === 'successful'
      ? 'icons/verified.png'
      : 'icons/failed.png';
    checkIcon.alt = found.status || 'Status';
  }

  // --- Fill the DOM ---
  if (statusTitle) statusTitle.textContent = statusText;
  if (statusMessage) statusMessage.innerHTML = `
    You've successfully completed ${capitalizedType.toLowerCase()} worth 
    <pss>${formattedAmount}</pss> to <pss>${found.phone}</pss>
  `;

  if (amountEl) amountEl.textContent = formattedAmount;

  destinationEl.forEach(el => {
    if (el) el.textContent = found.phone;
  });

  if (receiptBox) {
    receiptBox.innerHTML = `
      <h3 class="section-title">Transaction Details</h3>
      <div class="detail"><span>Transaction ID</span><span>${found.id}</span></div>
      <div class="detail"><span>Date</span><span>${formattedDate}</span></div>
      <div class="detail"><span>Destination</span><span>${found.phone}</span></div>
      <div class="detail"><span>Transaction Type</span><span>${capitalizedType}</span></div>
      <div class="detail"><span>Amount</span><span>${formattedAmount}</span></div>
      <div class="detail"><span>Network</span><span>${found.network}</span></div>
      <div class="detail"><span>Status</span><span>${found.status}</span></div>
    `;
  }
});

// Helper Functions
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatTitle(type) {
  if (!type) return '';
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}








// this below part work for payload
document.addEventListener("DOMContentLoaded", () => {
  const receipt = JSON.parse(localStorage.getItem('lastTransactionReceipt'));

  if (!receipt) {
    alert("No receipt data found.");
    window.location.href = "home.html";
    return;
  }

  document.getElementById('AmountToCharge').textContent = `₦${receipt.amount.toLocaleString()}`;
  document.querySelectorAll('#DestinationNumber').forEach(el => {
    el.textContent = receipt.phone;
  });

  const idElement = document.querySelector('.transaction-box .detail:nth-child(2) span:last-child');
  const dateElement = document.querySelector('.transaction-box .detail:nth-child(3) span:last-child');

  if (idElement) idElement.textContent = receipt.id;
  if (dateElement) {
    const date = new Date(receipt.time);
    const formatted = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toDateString()}`;
    dateElement.textContent = formatted;
  }
});
