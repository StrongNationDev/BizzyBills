import { getCurrentUser } from './user.js';

console.log('✅ verifydatapin.js loaded correctly');

const keypadButtons = document.querySelectorAll('.keypad button');
const loadingOverlay = document.getElementById('loading-overlay');
let pinInput = '';

function setPinBoxes(value) {
  const pinBoxes = document.querySelectorAll('.pin-boxes div');
  pinBoxes.forEach((box, i) => {
    box.textContent = value[i] || '';
  });
}

keypadButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.textContent.trim();

    if (value === '←') {
      pinInput = pinInput.slice(0, -1);
    } else if (!isNaN(value)) {
      if (pinInput.length < 4) pinInput += value;
    }

    setPinBoxes(pinInput);

  //   // Auto-submit when 4 digits
  //   if (pinInput.length === 4) {
  //     // small delay for UX so boxes render before action
  //     setTimeout(() => validateAndProcess(pinInput).catch(err => {
  //       console.error('validateAndProcess error:', err);
  //     }), 80);
  //   }

  // Auto-submit when 4 digits
    if (pinInput.length === 4) {
      // ✅ Show the loading overlay immediately to block the screen
      if (loadingOverlay) loadingOverlay.classList.add('active');

      // small delay for UX so boxes render before action
      setTimeout(() => validateAndProcess(pinInput).catch(err => {
        console.error('validateAndProcess error:', err);
        if (loadingOverlay) loadingOverlay.classList.remove('active'); // hide if error occurs before validate
      }), 80);
    }
  });
});

function parseAmountToNumber(amount) {
  if (typeof amount === 'number') return amount;
  if (!amount) return 0;
  const cleaned = String(amount).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

async function validateAndProcess(pin) {
  // Reset overlay and UI if needed
  try {
    const user = await getCurrentUser();
    if (!user) {
      alert('User not logged in');
      window.location.href = 'login.html';
      return;
    }

    if (user.pin !== pin) {
      alert('Incorrect PIN');
      pinInput = '';
      setPinBoxes('');
      return;
    }

    const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
    if (!payload || payload.type !== 'data') {
      alert('No pending data transaction.');
      window.location.href = 'data.html';
      return;
    }

    // determine numeric amount
    const amountNum = parseAmountToNumber(payload.amount ?? payload.price ?? payload.amount_paid);
    console.log(`AmountToPay: ₦${amountNum}`);

    if (user.wallet_balance < amountNum) {
      alert('Insufficient balance');
      return;
    }

    // show loading overlay (if element exists)
    // if (loadingOverlay) loadingOverlay.style.display = 'flex';
    if (loadingOverlay) loadingOverlay.classList.add('active');

    // call server - server will check user balance again and perform provider call + wallet update
    const resp = await fetch('http://localhost:5000/api/data', {
    // const resp = await fetch('https://bizzybillsng-sambas-api.onrender.com/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        network: payload.network_id,
        plan: payload.plan_id,
        mobile_number: payload.phone || payload.mobile_number,
        Ported_number: true,
        amount: amountNum,
        plan_label: payload.plan_label
      })
    });

    const json = await resp.json();
    console.log('📡 Server Response:', json);

    // if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (loadingOverlay) loadingOverlay.classList.remove('active');


    // success path: server returns { success:true, status:'successful', transaction_id, new_balance, transaction }
    if (json && json.success === true && json.status === 'successful') {
      // store receipt (use server-provided transaction if available)
      const receipt = json.transaction || {
        id: json.transaction_id || `TX-${Date.now()}`,
        type: 'data',
        network: payload.network,
        phone: payload.phone,
        plan: payload.plan_label,
        amount: amountNum,
        time: new Date().toISOString(),
        status: 'successful'
      };

      localStorage.setItem('lastTransactionReceipt', JSON.stringify(receipt));
      localStorage.removeItem('pendingTransaction');

      // redirect to success page
      window.location.href = 'datasuccess.html';
      return;
    }
  
    // failure path
    const message = json?.message || json?.sambas?.detail || json?.sambas?.error || 'Transaction failed. Try again.';
    alert(message);
    window.location.href = 'datafailed.html';

  }
   catch (err) {
    console.error('❌ Unexpected error in validateAndProcess:', err);
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    alert('Something went wrong. Please try again.');
    // window.location.href = 'datafailed.html';
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