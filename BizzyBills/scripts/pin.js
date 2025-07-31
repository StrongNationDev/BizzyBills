// scripts/pin.js
import { getCurrentUser, supabase } from './user.js';

// const API_URL = "http://localhost:5000/api/airtime";
const API_URL = "https://bizzybillsng-sambas-api.onrender.com/api/airtime";

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

    // Debug log
    console.log("Server response:", result);

    // ✅ Check with correct key
    if (!response.ok || result.Status !== 'successful') {
      await logTransaction(user, payload, 'failed');
      alert("Airtime transaction failed.");
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

    const { error } = await supabase
      .from('users')
      .update({
        wallet_balance: newBalance,
        history
      })
      .eq('id', user.id);

    if (error) {
      console.error("Supabase wallet update error:", error);
      alert("Airtime sent but wallet update failed. Contact admin.");
      return;
    }

    // Save to show in receipt.html
    localStorage.setItem('lastTransactionReceipt', JSON.stringify(transaction));
    localStorage.removeItem('pendingTransaction');
    window.location.href = 'receipt.html'; // ✅ Correct page

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong. Please try again later.");
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





// // scripts/pin.js
// import { getCurrentUser, supabase } from './user.js';

// const API_URL = "http://localhost:5000/api/airtime";

// const pinBoxes = document.querySelectorAll('.pin-boxes div');
// let pin = '';

// function updatePinBoxes() {
//   pinBoxes.forEach((box, idx) => {
//     box.textContent = pin[idx] || '';
//   });
// }

// document.querySelectorAll('.keypad button').forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const val = btn.textContent;

//     if (val === '←') {
//       pin = pin.slice(0, -1);
//     } else if (val === 'Enter') {
//       if (pin.length !== 4) {
//         alert("Enter your 4-digit PIN");
//         return;
//       }
//       await verifyAndTransact();
//     } else {
//       if (pin.length < 4) {
//         pin += val;
//       }
//     }

//     updatePinBoxes();
//   });
// });

// async function verifyAndTransact() {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   if (user.pin !== pin) {
//     alert("Incorrect PIN!");
//     pin = '';
//     updatePinBoxes();
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload) {
//     alert("No transaction data found.");
//     return;
//   }

//   if (user.wallet_balance < payload.amount) {
//     alert("Insufficient wallet balance.");
//     return;
//   }

//   const requestPayload = {
//     network: payload.network_id,
//     amount: payload.amount,
//     mobile_number: payload.phone,
//     Ported_number: true,
//     airtime_type: 'VTU'
//   };


//   // [Proceed with transaction logic...]
//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestPayload)
//     });

//     const result = await response.json();

//     if (!response.ok || result.status !== 'successful') {
//       await logTransaction(user, payload, 'failed');
//       alert("Airtime transaction failed.");
//       window.location.href = 'failed.html';
//       return;
//     }

//     const newBalance = user.wallet_balance - payload.amount;
//     const history = user.history || [];

//     const transaction = {
//       type: 'airtime',
//       phone: payload.phone,
//       amount: payload.amount,
//       network: payload.network,
//       status: 'successful',
//       time: new Date().toISOString(),
//       id: result.ref || result.transaction_id || crypto.randomUUID()
//     };

//     history.push(transaction);

//     const { error } = await supabase
//       .from('users')
//       .update({
//         wallet_balance: newBalance,
//         history
//       })
//       .eq('id', user.id);

//     if (error) {
//       alert("Airtime sent but wallet update failed. Contact admin.");
//       return;
//     }

//     // Save to show in receipt.html
//     localStorage.setItem('lastTransactionReceipt', JSON.stringify(transaction));

//     // Done
//     localStorage.removeItem('pendingTransaction');
//     window.location.href = 'receipt.html';

//   } catch (err) {
//     console.error("Unexpected error:", err);
//     alert("Something went wrong. Please try again later.");
//     window.location.href = 'failed.html';
//   }
// }

// async function logTransaction(user, payload, status) {
//   const history = user.history || [];
//   history.push({
//     type: 'airtime',
//     phone: payload.phone,
//     amount: payload.amount,
//     network: payload.network,
//     status,
//     time: new Date().toISOString()
//   });

//   await supabase
//     .from('users')
//     .update({ history })
//     .eq('id', user.id);
// }
















