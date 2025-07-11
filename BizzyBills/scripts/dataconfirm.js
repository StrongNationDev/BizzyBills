// // scripts/dataconfirm.js
// import { getCurrentUser } from './user.js';

// (async () => {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload || payload.type !== 'data') {
//     alert("No pending data transaction found.");
//     window.location.href = "data.html";
//     return;
//   }

//   // Update UI
//   const amountDisplay = `₦${payload.amount.toLocaleString()} - ${payload.plan_label}`;

//   // const amountDisplay = `₦${payload.amount.toLocaleString()}`;
//   const destination = payload.phone;
//   const networkName = payload.network;
//   const networkIcon = payload.network_icon;

//   // Fill confirmation page
//   const amountElements = document.querySelectorAll('#AmountToCharge');
//   amountElements.forEach(el => el.textContent = amountDisplay);

//   document.getElementById('DestinationNumber').textContent = destination;

//   const productSpan = document.querySelector('.payment-details .detail:nth-child(2) span:last-child');
//   if (productSpan) productSpan.textContent = "Data Subscription";

//   const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
//   if (networkSpan) {
//     networkSpan.innerHTML = `<img src="${networkIcon}" alt="${networkName}" class="icon" /> ${networkName}`;
//   }
// })();

// // scripts/dataconfirm.js
// import { getCurrentUser } from './user.js';

// (async () => {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload || payload.type !== 'data') {
//     alert("No pending data transaction found.");
//     window.location.href = "data.html";
//     return;
//   }

//   // Update UI with plan info
//   const amountDisplay = `₦${payload.amount.toLocaleString()} - ${payload.plan_label}`;
//   const destination = payload.phone;
//   const networkName = payload.network;
//   const networkIcon = payload.network_icon;

//   // Fill confirmation page
//   const amountElements = document.querySelectorAll('#AmountToCharge');
//   amountElements.forEach(el => el.textContent = amountDisplay);

//   document.getElementById('DestinationNumber').textContent = destination;

//   const productSpan = document.querySelector('.payment-details .detail:nth-child(2) span:last-child');
//   if (productSpan) productSpan.textContent = "Data Subscription";

//   const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
//   if (networkSpan) {
//     networkSpan.innerHTML = `<img src="${networkIcon}" alt="${networkName}" class="icon" /> ${networkName}`;
//   }
// })();



// scripts/dataconfirm.js
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
    window.location.href = "home.html";
    return;
  }

  // Prepare dynamic values
  let amountDisplay = `₦${payload.amount.toLocaleString()}`;
  if (payload.plan_label) {
    amountDisplay += ` - ${payload.plan_label}`;
  }

  const productName = payload.type === 'airtime'
    ? 'Airtime Recharge'
    : payload.type === 'data'
    ? 'Data Subscription'
    : 'Unknown Product';

  // Update all .amount-display elements
  const amountEls = document.querySelectorAll('.amount-display');
  amountEls.forEach(el => el.textContent = amountDisplay);

  // Update destination
  document.getElementById('DestinationNumber').textContent = payload.phone;

  // Update product type
  const productEl = document.querySelector('.product-type');
  if (productEl) productEl.textContent = productName;

  // Update network with icon
  const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
  if (networkSpan && payload.network_icon && payload.network) {
    networkSpan.innerHTML = `<img src="${payload.network_icon}" alt="${payload.network}" class="icon" /> ${payload.network}`;
  }
})();







// scripts/datapin.js
import { getCurrentUser, supabase } from './user.js';

const keypadButtons = document.querySelectorAll('.keypad button');
let pinInput = '';

keypadButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.textContent.trim();
    if (value === 'Enter') {
      if (pinInput.length === 4) {
        await validateAndProcess(pinInput);
      } else {
        alert("Enter 4-digit PIN");
      }
    } else if (value === '←') {
      pinInput = pinInput.slice(0, -1);
    } else {
      if (pinInput.length < 4) pinInput += value;
    }

    const pinBoxes = document.querySelectorAll('.pin-boxes div');
    pinBoxes.forEach((box, i) => {
      box.textContent = pinInput[i] || '';
    });
  });
});

async function validateAndProcess(pin) {
  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  if (user.pin !== pin) {
    alert("Incorrect PIN");
    return;
  }

  const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
  if (!payload || payload.type !== 'data') {
    alert("No pending data transaction.");
    window.location.href = "data.html";
    return;
  }

  // Wallet check
  if (user.wallet_balance < payload.amount) {
    alert("Insufficient balance");
    return;
  }

  // Trigger API
  const response = await fetch('https://www.husmodata.com/api/data/', {
    method: 'POST',
    headers: {
      'Authorization': 'Token 8f00fa816b1e3b485baca8f44ae5d361ef803311',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: payload.network_id,
      plan: payload.plan_id,
      mobile_number: payload.phone,
      Ported_number: true
    })
  });

  const result = await response.json();
  if (!response.ok || result.status !== 'successful') {
    alert("Transaction failed. Try again.");
    return;
  }

  // Deduct wallet & log history
  const newBalance = user.wallet_balance - payload.amount;
  const newHistory = user.history || [];
  newHistory.push({
    type: 'data',
    phone: payload.phone,
    amount: payload.amount,
    plan: payload.plan_text,
    time: new Date().toISOString()
  });

  const { error } = await supabase.from('users').update({
    wallet_balance: newBalance,
    history: newHistory
  }).eq('id', user.id);

  if (error) {
    alert("Data sent but failed to update wallet. Contact admin.");
    return;
  }

  alert("Data purchase successful!");
  localStorage.removeItem('pendingTransaction');
  window.location.href = 'success.html';
}