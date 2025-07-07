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








// import { getCurrentUser, supabase } from './user.js';

// const pinBoxes = document.querySelectorAll('.pin-boxes div');
// const buttons = document.querySelectorAll('.keypad button');
// let pin = '';

// buttons.forEach(button => {
//   button.addEventListener('click', () => {
//     if (button.classList.contains('backspace')) {
//       pin = pin.slice(0, -1);
//     } else if (button.classList.contains('enter')) {
//       confirmPayment(pin);
//     } else if (pin.length < 4) {
//       pin += button.textContent;
//     }

//     pinBoxes.forEach((box, i) => {
//       box.textContent = pin[i] || '';
//     });
//   });
// });

// async function confirmPayment(inputPin) {
//   const user = await getCurrentUser();
//   if (!user || !user.pin) return alert('User not authenticated.');

//   if (inputPin !== user.pin) return alert('Invalid PIN.');

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload) return alert('Transaction expired.');

//   // Check balance again
//   const { data, error } = await supabase
//     .from('users')
//     .select('wallet_balance, history')
//     .eq('id', user.id)
//     .single();

//   if (error || !data || data.wallet_balance < payload.amount) {
//     alert('Insufficient balance');
//     return;
//   }

//   const res = await fetch('https://www.husmodata.com/api/topup/', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Token 8f00fa816b1e3b485baca8f44ae5d361ef803311',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       network: payload.network_id,
//       amount: payload.amount,
//       mobile_number: payload.phone,
//       Ported_number: true,
//       airtime_type: 'VTU'
//     })
//   });

//   const result = await res.json();
//   const isSuccess = result.status && result.status.toLowerCase() === 'successful';

//   const newBalance = isSuccess ? data.wallet_balance - payload.amount : data.wallet_balance;
//   const history = data.history || [];
//   history.push({
//     ...payload,
//     status: isSuccess ? 'success' : 'failed',
//     api_response: result,
//     time: new Date().toISOString()
//   });

//   await supabase
//     .from('users')
//     .update({ wallet_balance: newBalance, history })
//     .eq('id', user.id);

//   alert(isSuccess ? 'Airtime sent successfully!' : 'Airtime failed.');
//   window.location.href = 'home.html';
// }
