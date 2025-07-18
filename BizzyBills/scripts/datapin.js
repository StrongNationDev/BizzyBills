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

  if (user.wallet_balance < payload.amount) {
    alert("Insufficient balance");
    return;
  }

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
  if (!response.ok || !result.status || result.status !== "successful") {
    alert("Transaction failed. Try again.");
    return;
  }

  const newBalance = user.wallet_balance - payload.amount;

  const newHistory = user.history || [];
  const transactionRecord = {
    id: Date.now(),
    type: 'data',
    network: payload.network,
    phone: payload.phone,
    plan: payload.plan_label,
    amount: payload.amount,
    time: new Date().toISOString()
  };
  newHistory.unshift(transactionRecord);

  const { error } = await supabase
    .from('users')
    .update({
      wallet_balance: newBalance,
      history: newHistory
    })
    .eq('id', user.id);

  if (error) {
    alert("Data sent but failed to update wallet. Contact admin.");
    return;
  }

  localStorage.setItem('lastTransaction', JSON.stringify({
    transaction_id: result.ref || `TX-${Date.now()}`,
    phone: payload.phone,
    amount: payload.amount,
    plan_name: payload.plan_label
  }));

  localStorage.removeItem('pendingTransaction');
  window.location.href = 'success.html';
}
