import { getCurrentUser, supabase } from './user.js';

const API_URL = "http://localhost:5000/api/airtime";

// const API_URL = "https://bizzybillsng-sambas-api.onrender.com/api/airtime";
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

  const requestPayload = {
    network: payload.network_id,
    amount: payload.amount,
    mobile_number: payload.phone,
    Ported_number: true,
    airtime_type: 'VTU'
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });







    const result = await response.json();

    if (!response.ok || result.Status !== 'successful') {
      await logTransaction(user, payload, 'failed');
      window.location.href = 'failed.html';
      return;
    }

    const newBalance = user.wallet_balance - payload.amount;
    const history = user.history || [];

    const transaction = {
      type: 'airtime',
      phone: payload.phone,
      amount: payload.amount,
      network: payload.network,
      status: 'successful',
      time: new Date().toISOString(),
      id: result.id?.toString() || result.ident || crypto.randomUUID()
    };

    history.push(transaction);

    const walletUpdateRes = await fetch('http://localhost:5000/api/update-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        amount: payload.amount,
        transaction
      })
    });

    const walletUpdateResult = await walletUpdateRes.json();

    if (!walletUpdateRes.ok || !walletUpdateResult.success) {
      console.error("Wallet update error:", walletUpdateResult.error);
      alert("Airtime sent but wallet update failed. Contact admin.");
      return;
    }


// Testting




    localStorage.setItem('lastTransactionReceipt', JSON.stringify(transaction));
    localStorage.removeItem('pendingTransaction');
    window.location.href = 'receipt.html';

  } catch (err) {
    console.error("Unexpected error:", err);
    window.location.href = 'failed.html';
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
