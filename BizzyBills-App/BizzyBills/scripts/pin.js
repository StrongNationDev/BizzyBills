import { getCurrentUser, supabase } from './user.js';

// const API_URL = "http://localhost:5000/api/airtime";

// const API_URL = "https://bizzybillsng-sambas-api.onrender.com/api/airtime";
const API_URL = "http://localhost:5000/api/airtime";
const pinBoxes = document.querySelectorAll('.pin-boxes div');
const modal = document.getElementById('forgotModal');
let pin = '';

function updatePinBoxes() {
  pinBoxes.forEach((box, idx) => {
    box.textContent = pin[idx] || '';
  });
}

function openModal(message) {
  modal.querySelector('p').textContent = message;
  modal.style.display = 'block';
}

window.closeModal = function () {
  modal.style.display = 'none';
};

document.querySelectorAll('.keypad button').forEach(btn => {
  btn.addEventListener('click', async () => {
    const val = btn.textContent;

    if (val === '←') {
      pin = pin.slice(0, -1);
    } else if (!isNaN(val) && pin.length < 4) {
      pin += val;
    }

    updatePinBoxes();

    if (pin.length === 4) {
      await verifyAndTransact();
    }
  });
});

async function verifyAndTransact() {
  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  if (user.pin !== pin) {
    pin = '';
    updatePinBoxes();
    openModal("You have input an incorrect transaction PIN. If you forget your PIN, go to your Profile to check it.");
    return;
  }

  const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
  if (!payload) {
    alert("No transaction data found.");
    return;
  }

  if (user.wallet_balance < payload.amount) {
    alert("Insufficient wallet balance.");
    return;
  }

  // ✅ Show the loading overlay
  // document.getElementById('loading-overlay').style.display = 'flex';
  document.getElementById('loading-overlay').classList.add('active');








  const requestPayload = {
    network: payload.network_id,
    amount: payload.amount,
    mobile_number: payload.phone,
    Ported_number: true,
    airtime_type: 'VTU'
  };

  try {
  // STEP 1: Pre-debit wallet
  const debitRes = await fetch('http://localhost:5000/api/debit-user', {
    // const debitRes = await fetch('https://bizzybillsng-sambas-api.onrender.com/api/debit-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      amount: payload.amount
    })
  });

  const debitResult = await debitRes.json();

  if (!debitRes.ok || !debitResult.success) {
    alert("Wallet debit failed. Transaction cancelled.");
    return;
  }

  // STEP 2: Send airtime
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload)
  });

  const result = await response.json();


  // updating this to check for both response.ok and result.Status

  // if (!response.ok || result.Status !== 'successful') {

    const isSuccess = 
    result.Status?.toLowerCase() === 'successful' || 
    result.status === true || 
    result.message?.toLowerCase().includes('success');

  if (!response.ok || !isSuccess) {

    // Airtime failed — REFUND
    // await fetch('https://bizzybillsng-sambas-api.onrender.com/api/refund-user', {
      await fetch('http://localhost:5000/api/refund-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        amount: payload.amount
      })
    });

    await logTransaction(user, payload, 'failed');
    window.location.href = 'failed.html';
    return;
  }

  // STEP 3: Airtime successful — log history
  const transaction = {
    type: 'airtime',
    phone: payload.phone,
    amount: payload.amount,
    network: payload.network,
    status: 'successful',
    time: new Date().toISOString(),
    id: result.id?.toString() || result.ident || crypto.randomUUID()
  };

  const history = user.history || [];
  history.push(transaction);

  // Update user history in Supabase
  const { error } = await supabase
    .from('users')
    .update({ history })
    .eq('id', user.id);

  if (error) {
    console.error("Failed to update history:", error);
  }

  // Final cleanup and redirect
  localStorage.setItem('lastTransactionReceipt', JSON.stringify(transaction));
  localStorage.removeItem('pendingTransaction');
  window.location.href = 'airtimesuccess.html';


  } catch (err) {
    console.error("Unexpected error:", err);
    window.location.href = 'failed.html';
  } finally {
    // ✅ Always hide the overlay at the end (except on redirect, which ends execution anyway)
    // document.getElementById('loading-overlay').style.display = 'none';
    // Hide overlay
    document.getElementById('loading-overlay').classList.remove('active');

  }
}

async function logTransaction(user, payload, status) {
  const history = user.history || [];
  history.push({
    type: 'airtime',
    phone: payload.phone,
    amount: payload.amount,
    network: payload.network,
    status,
    time: new Date().toISOString()
  });

  const { error } = await supabase
    .from('users')
    .update({ history })
    .eq('id', user.id);

  if (error) {
    console.error("Failed to log transaction:", error);
  }
}


// fogot pin modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const forgotText = document.querySelector('.forgot-text');
  const modal = document.getElementById('forgotModal');

  forgotText.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  window.closeModal = function () {
    modal.style.display = 'none';
  }

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});
