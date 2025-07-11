// scripts/pin.js
import { getCurrentUser, supabase } from './user.js';

const API_URL = "https://www.husmodata.com/api/topup/";
const API_KEY = "8f00fa816b1e3b485baca8f44ae5d361ef803311";

// Handle PIN Input
const pinBoxes = document.querySelectorAll('.pin-boxes div');
let pin = '';

function updatePinBoxes() {
  pinBoxes.forEach((box, idx) => {
    box.textContent = pin[idx] || '';
  });
}

document.querySelectorAll('.keypad button').forEach(btn => {
  btn.addEventListener('click', async () => {
    const val = btn.textContent;

    if (val === '←') {
      pin = pin.slice(0, -1);
    } else if (val === 'Enter') {
      if (pin.length !== 4) {
        alert("Enter your 4-digit PIN");
        return;
      }
      await verifyAndTransact();
    } else {
      if (pin.length < 4) {
        pin += val;
      }
    }

    updatePinBoxes();
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
    alert("Incorrect PIN!");
    pin = '';
    updatePinBoxes();
    return;
  }

  const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
  if (!payload) {
    alert("No transaction data found.");
    return;
  }

  // Check balance
  if (user.wallet_balance < payload.amount) {
    alert("Insufficient balance");
    return;
  }

  // Step 1: Make the transaction via Husmodata API
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        network: payload.network_id,
        amount: payload.amount,
        mobile_number: payload.phone,
        Ported_number: true,
        airtime_type: 'VTU'
      })
    });

    const result = await res.json();
    if (!res.ok || result.status !== 'successful') {
      alert("Transaction failed. Please try again.");
      console.error(result);
      return;
    }

    // Step 2: Deduct balance and update history
    const newBalance = user.wallet_balance - payload.amount;
    const newHistory = user.history || [];
    newHistory.push({
      type: 'airtime',
      phone: payload.phone,
      amount: payload.amount,
      network: payload.network,
      time: new Date().toISOString()
    });

    const { error } = await supabase
      .from('users')
      .update({
        wallet_balance: newBalance,
        history: newHistory
      })
      .eq('id', user.id);

    if (error) {
      alert("Airtime sent but failed to update wallet. Contact support.");
      return;
    }

    alert("Transaction successful!");
    localStorage.removeItem('pendingTransaction');
    window.location.href = 'home.html';

  } catch (err) {
    alert("Something went wrong.");
    console.error(err);
  }
}







































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
