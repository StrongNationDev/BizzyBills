
//   // Initial population of plans based on the first selected network
//   function populatePlans(networkId, offerName) {
//   planSelect.innerHTML = '';

//   const plans = dataPlans[networkId]?.[offerName];
//   if (!plans || plans.length === 0) {
//     const option = document.createElement('option');
//     option.textContent = 'No plans available';
//     planSelect.appendChild(option);
//     return;
//   }

//   plans.forEach(plan => {
//     const option = document.createElement('option');
//     option.value = plan.id;
//     option.textContent = plan.label;
//     planSelect.appendChild(option);
//   });
// }

// function populateOffers(networkId) {
//   offerSelect.innerHTML = '<option value="">Select Offer</option>';

//   const offers = Object.keys(dataPlans[networkId] || {});
//   offers.forEach(offer => {
//     const option = document.createElement('option');
//     option.value = offer;
//     option.textContent = offer;
//     offerSelect.appendChild(option);
//   });
// }

// radio.addEventListener('change', () => {
//   // Reset label background
//   networkRadios.forEach(r => r.closest('label').style.backgroundColor = '');
//   label.style.backgroundColor = 'black';

//   selectedNetworkName = img.alt;
//   selectedNetworkIcon = img.src;

//   switch (selectedNetworkName.toUpperCase()) {
//     case 'MTN': selectedNetworkId = 1; break;
//     case 'GLO': selectedNetworkId = 2; break;
//     case 'AIRTEL': selectedNetworkId = 4; break;
//     default: selectedNetworkId = null;
//   }

//   // Reset offer and plans
//   offerSelect.innerHTML = '<option value="">Select Offer</option>';
//   planSelect.innerHTML = '<option>Select Plan</option>';

//   populateOffers(selectedNetworkId);
// });

// offerSelect.addEventListener('change', () => {
//   const selectedOffer = offerSelect.value;
//   if (selectedOffer && selectedNetworkId) {
//     populatePlans(selectedNetworkId, selectedOffer);
//   }
// });































// // Plan database by network ID
// const dataPlans = {
//   1: [ // MTN
//     { id: 907, label: '150.0 MB - ₦110 (1Day) MTN SME' },
//     { id: 854, label: '16.5 GB - ₦6500 (1Month) MTN GIFTING' },
//     { id: 921, label: '1.0 GB - ₦1096 (7days) MTN GIFTING' },
//     { id: 856, label: '230.0 MB - ₦250 (1Day) MTN GIFTING' },
//     { id: 837, label: '110.0 MB - ₦110 (1Day) MTN GIFTING' },
//     { id: 716, label: '3.0 GB - ₦2000 (1Month) MTN SME' },
//     { id: 870, label: '2.5 GB - ₦965 (2-3Days) MTN GIFTING' },
//     { id: 871, label: '20.0 GB - ₦5100 (7DAYS) MTN GIFTING' },
//     { id: 866, label: '3.5 GB - ₦1600 (7Days) MTN GIFTING' },
//     { id: 845, label: '500.0 MB - ₦395 (1Day) MTN GIFTING' },
//     { id: 846, label: '20.0 GB - ₦7600 (1Month) MTN GIFTING' },
//     { id: 929, label: '1.2 GB - ₦800 (7Days MTN Pulse Users) MTN GIFTING' },
//     { id: 903, label: '500.0 MB - ₦395 (1Day) MTN SME' },
//     { id: 859, label: '200.0 GB - ₦49000 (2Month) MTN GIFTING' },
//     { id: 838, label: '1.5 GB - ₦1100 (7Days) MTN GIFTING' },
//     { id: 835, label: '75.0 MB - ₦80 (1Day) MTN GIFTING' },
//     { id: 833, label: '3.2 GB - ₦1095 (2-3Days) MTN GIFTING' },
//     { id: 906, label: '230.0 MB - ₦250 (1Day) MTN SME' },
//     { id: 848, label: '1.0 GB - ₦480 (1-2Days) MTN GIFTING' },
//     { id: 882, label: '10.0 GB - ₦4800 (1Month) MTN GIFTING' },
//     { id: 881, label: '1.5 GB - ₦650 (2-3Days) MTN GIFTING' },
//     { id: 927, label: '500.0 MB - ₦500 (7Days) MTN GIFTING' },
//     { id: 928, label: '750.0 MB - ₦500 (3Days MTN Pulse Users) MTN GIFTING' },
//     { id: 663, label: '2.0 GB - ₦1350 (1Month) MTN SME' },
//     { id: 844, label: '12.5 GB - ₦5600 (1Month) MTN GIFTING' },
//     { id: 853, label: '7.0 GB - ₦3600 (1Month) MTN GIFTING' },
//     { id: 862, label: '75.0 GB - ₦17900 (1Month) MTN GIFTING' },
//     { id: 847, label: '11.0 GB - ₦3600 (7Days) MTN GIFTING' },
//     { id: 850, label: '2.0 GB - ₦800 (2-3Days) MTN GIFTING' },
//     { id: 849, label: '6.0 GB - ₦2650 (7Days) MTN GIFTING' },
//     { id: 842, label: '3.5 GB - ₦2600 (1Month) MTN GIFTING' },
//     { id: 843, label: '2.7 GB - ₦2100 (1Month) MTN GIFTING' },
//     { id: 717, label: '5.0 GB - ₦2500 (1month) MTN SME' },
//     { id: 691, label: '1.0 GB - ₦695 (1Month) MTN SME' },
//     { id: 834, label: '2.5 GB - ₦800 (1Day) MTN GIFTING' },
//     { id: 841, label: '2.0 GB - ₦1600 (1Month) MTN GIFTING' },
//     { id: 917, label: '1.2 GB - ₦795 (7Days MTN Pulse Users) MTN SME' },
//     { id: 860, label: '90.0 GB - ₦25500 (2Month) MTN GIFTING' },
//     { id: 861, label: '150.0 GB - ₦39000 (2Month) MTN GIFTING' },
//     { id: 891, label: '11.0 GB - ₦3700 (7Days) MTN SME' },
//     { id: 863, label: '36.0 GB - ₦11500 (1Month) MTN GIFTING' },
//     { id: 864, label: '25.0 GB - ₦9000 (1Month) MTN GIFTING' },
//     { id: 908, label: '6.0 GB - ₦2650 (7Days) MTN SME' },
//   ],
//   2: [ // GLO
//     { id: 910, label: '3.0 GB - ₦1000 (3Days) GLO CORPORATE GIFTING' },
//     { id: 221, label: '500.0 MB - ₦250 (1 Month) GLO CORPORATE GIFTING' },
//     { id: 421, label: '1.5 GB - ₦450 (1-2Days) GLO GIFTING' },
//     { id: 521, label: '2.5 GB - ₦600 (2DAYS) GLO GIFTING' },
//     { id: 476, label: '10.0 GB - ₦2300 (7DAYS) GLO GIFTING' },
//     { id: 539, label: '750.0 MB - ₦245 (1Day) GLO GIFTING' },
//     { id: 912, label: '1.0 GB - ₦500 (1Month) GLO CORPORATE GIFTING' },
//     { id: 902, label: '200.0 MB - ₦150 (1Month) GLO CORPORATE GIFTING' },
//     { id: 911, label: '5.0 GB - ₦1700 (3Days) GLO CORPORATE GIFTING' },
//     { id: 913, label: '2.0 GB - ₦900 (1Month) GLO CORPORATE GIFTING' },
//     { id: 914, label: '3.0 GB - ₦1500 (1Month) GLO CORPORATE GIFTING' },
//     { id: 915, label: '10.0 GB - ₦4800 (1Month) GLO CORPORATE GIFTING' },
//     { id: 916, label: '5.0 GB - ₦2500 (1Month) GLO CORPORATE GIFTING' },
//     { id: 909, label: '1.0 GB - ₦400 (3Days) GLO CORPORATE GIFTING' },

//   ],
//   4: [ // AIRTEL
//     { id: 868, label: '200.0 MB - ₦200 (1Day) AIRTEL GIFTING' },
//     { id: 767, label: '1.5 GB - ₦1100 (7Days) AIRTEL GIFTING' },
//     { id: 920, label: '3.0 GB - ₦1100 (2DAYS) AIRTEL GIFTING' },
//     { id: 918, label: '3.0 GB - ₦1200 (7Days Dont owe debt) AIRTEL GIFTING' },
//     { id: 919, label: '10.0 GB - ₦4000 (1Month) AIRTEL GIFTING' },
//     { id: 777, label: '60.0 GB - ₦16000 (1month) AIRTEL GIFTING' },
//     { id: 867, label: '100.0 MB - ₦150 (1Day) AIRTEL GIFTING' },
//     { id: 769, label: '3.0 GB - ₦2100 (1month) AIRTEL GIFTING' },
//     { id: 770, label: '4.0 GB - ₦2500 (1month) AIRTEL GIFTING' },
//     { id: 923, label: '150.0 MB - ₦80 (1Day Dont owe debt) AIRTEL GIFTING' },
//     { id: 889, label: '1.5 GB - ₦700 (2DAYS) AIRTEL GIFTING' },
//     { id: 771, label: '8.0 GB - ₦3200 (1month) AIRTEL GIFTING' },
//     { id: 926, label: '600.0 MB - ₦300 (2Day Dont owe debt) AIRTEL GIFTING' },
//     { id: 925, label: '300.0 MB - ₦150 (1Day Dont owe debt) AIRTEL GIFTING' },
//     { id: 890, label: '2.0 GB - ₦800 (2Days) AIRTEL GIFTING' },
//     { id: 722, label: '1.0 GB - ₦400 (1Day Dont owe debt) AIRTEL GIFTING' },
//     { id: 829, label: '3.5 GB - ₦1600 (7Days) AIRTEL GIFTING' },
//     { id: 773, label: '13.0 GB - ₦5200 (1month) AIRTEL GIFTING' },
//     { id: 774, label: '18.0 GB - ₦6500 (1month) AIRTEL GIFTING' },
//     { id: 775, label: '25.0 GB - ₦8500 (1month) AIRTEL GIFTING' },
//     { id: 869, label: '300.0 MB - ₦300 (1Day) AIRTEL GIFTING' },
//     { id: 772, label: '10.0 GB - ₦4200 (1month) AIRTEL GIFTING' },
//     { id: 768, label: '2.0 GB - ₦1500 (1month) AIRTEL GIFTING' },
//     { id: 741, label: '2.0 GB - ₦700 (2Days Dont owe debt) AIRTEL GIFTING' },
//     { id: 757, label: '7.0 GB - ₦2350 (7Days Dont owe debt) AIRTEL GIFTING' },
//     { id: 758, label: '10.0 GB - ₦3500 (7Days Dont owe debt) AIRTEL GIFTING' },
//     { id: 809, label: '5.0 GB - ₦1500 (2-3Days) AIRTEL GIFTING' },
//     { id: 763, label: '1.0 GB - ₦795 (7days) AIRTEL GIFTING' },
//     { id: 748, label: '4.0 GB - ₦1000 (2Days Dont owe debt) AIRTEL GIFTING' },
//     { id: 749, label: '1.5 GB - ₦500 (1Day Dont owe debt) AIRTEL GIFTING' },
//     { id: 776, label: '35.0 GB - ₦11000 (1month) AIRTEL GIFTING' },

//   ]
// };





































// trash from verifydatapin.js
// import { getCurrentUser } from './user.js';

// console.log("✅ verifydatapin.js loaded correctly");

// const keypadButtons = document.querySelectorAll('.keypad button');
// let pinInput = '';

// keypadButtons.forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const value = btn.textContent.trim();

//     if (value === 'Enter') {
//       if (pinInput.length === 4) {
//         await validateAndProcess(pinInput);
//       } else {
//         alert("Enter 4-digit PIN");
//       }
//     } else if (value === '←') {
//       pinInput = pinInput.slice(0, -1);
//     } else {
//       if (pinInput.length < 4) pinInput += value;
//     }

//     const pinBoxes = document.querySelectorAll('.pin-boxes div');
//     pinBoxes.forEach((box, i) => {
//       box.textContent = pinInput[i] || '';
//     });
//   });
// });

// async function validateAndProcess(pin) {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

// // i will maeke Limit retry of pin here later
//   if (user.pin !== pin) {
//     alert("Incorrect PIN");
//     pinInput = '';
//     const pinBoxes = document.querySelectorAll('.pin-boxes div');
//     pinBoxes.forEach(box => box.textContent = '');
//     return;
//   }


//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload || payload.type !== 'data') {
//     alert("No pending data transaction.");
//     window.location.href = "data.html";
//     return;
//   }

//   if (user.wallet_balance < payload.amount) {
//     alert("Insufficient balance");
//     return;
//   }

//   try {
//     // Step 1: Perform the data transaction via the backend
//     const response = await fetch('http://localhost:5000/api/data', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         network: payload.network_id,
//         plan: payload.plan_id,
//         mobile_number: payload.phone,
//         Ported_number: true,
//         amount: payload.amount,
//         plan_label: payload.plan_label
//       })
//     });

//     const result = await response.json();
//     console.log("Sambaswallet API response:", result);

//     if (!response.ok || result.status !== "successful") {
//       await logTransaction(user.id, payload, 'failed');
//       alert("Transaction failed. Try again.");
//       window.location.href = 'datafailed.html';
//       return;
//     }
//     console.log("Response status:", response.status);


//     // Step 2: Ask server to deduct wallet and log transaction
//     const updateResponse = await fetch('http://localhost:5000/api/update-wallet', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId: user.id,
//         amount: payload.amount,
//         transaction: {
//           id: result.transaction_id,
//           type: 'data',
//           network: payload.network,
//           phone: payload.phone,
//           plan: payload.plan_label,
//           amount: payload.amount,
//           time: new Date().toISOString(),
//           status: 'successful'
//         }
//       })
//     });

//     const updateResult = await updateResponse.json();

//     if (!updateResponse.ok || !updateResult.success) {
//       alert("Data sent but wallet update failed. Contact admin.");
//       return;
//     }

//     // Step 3: Save receipt and redirect to datasuccess.html
//     localStorage.setItem('lastTransactionReceipt', JSON.stringify({
//       id: result.transaction_id,
//       type: 'data',
//       network: payload.network,
//       phone: payload.phone,
//       plan: payload.plan_label,
//       amount: payload.amount,
//       time: new Date().toISOString(),
//       status: 'successful'
//     }));
//     localStorage.removeItem('pendingTransaction');

//     window.location.href = 'datasuccess.html';

//   } catch (err) {
//     console.error("Unexpected error:", err);
//     alert("Something went wrong.");
//     window.location.href = 'datafailed.html';
//   }
// }

// async function logTransaction(userId, payload, status) {
//   const transaction = {
//     id: `TX-${Date.now()}`,
//     type: 'data',
//     network: payload.network,
//     phone: payload.phone,
//     plan: payload.plan_label,
//     amount: payload.amount,
//     time: new Date().toISOString(),
//     status
//   };

//   // Append transaction directly to user history from backend
//   await fetch('http://localhost:5000/api/update-wallet', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ userId, amount: 0, transaction }) // No deduction, just logging
//   });
// }













// from dataconfirm.js





















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
//   const { amount, phone, network, network_icon, plan_label } = payload;

//   const qualityMatch = plan_label.match(/^(.+?)\s*-\s*₦/); // e.g. "10GB"
//   const periodMatch = plan_label.match(/\(([^)]+)\)/);


//   const dataQuality = qualityMatch ? qualityMatch[1] : '';
//   const dataPeriod = periodMatch ? periodMatch[1] : '';

//   const amountDisplay = `₦${amount.toLocaleString()} - ${plan_label}`;
//   const amountElements = document.querySelectorAll('#AmountToCharge');
//   amountElements.forEach(el => el.textContent = amountDisplay);

//   document.getElementById('DestinationNumber').textContent = phone;

//   const networkSpan = document.querySelector('.payment-details .detail:nth-child(1) span:last-child');
//   if (networkSpan) {
//     networkSpan.innerHTML = `<img src="${network_icon}" alt="${network}" class="icon"> ${network}`;
//   }

//   const productSpan = document.querySelector('.payment-details .detail:nth-child(2) span:last-child');
//   if (productSpan) productSpan.textContent = "Data Subscription";

//   const qualityEl = document.getElementById('DataQuality');
//   if (qualityEl) qualityEl.textContent = dataQuality;

//   const periodEl = document.getElementById('DataPeriod');
//   if (periodEl) periodEl.textContent = dataPeriod;
// })();


// const keypadButtons = document.querySelectorAll('.keypad button');
// let pinInput = '';

// keypadButtons.forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const value = btn.textContent.trim();
//     if (value === 'Enter') {
//       if (pinInput.length === 4) {
//         await validateAndProcess(pinInput);
//       } else {
//         alert("Enter 4-digit PIN");
//       }
//     } else if (value === '←') {
//       pinInput = pinInput.slice(0, -1);
//     } else {
//       if (pinInput.length < 4) pinInput += value;
//     }

//     const pinBoxes = document.querySelectorAll('.pin-boxes div');
//     pinBoxes.forEach((box, i) => {
//       box.textContent = pinInput[i] || '';
//     });
//   });
// });

// async function validateAndProcess(pin) {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   if (user.pin !== pin) {
//     alert("Incorrect PIN");
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload || payload.type !== 'data') {
//     alert("No pending data transaction.");
//     window.location.href = "data.html";
//     return;
//   }

//   if (user.wallet_balance < payload.amount) {
//     alert("Insufficient balance");
//     return;
//   }


  
//   const response = await fetch('https://www.husmodata.com/api/data/', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Token 8f00fa816b1e3b485baca8f44ae5d361ef803311',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       network: payload.network_id,
//       plan: payload.plan_id,
//       mobile_number: payload.phone,
//       Ported_number: true
//     })
//   });

//   const result = await response.json();
//   if (!response.ok || result.status !== 'successful') {
//     alert("Transaction failed. Try again.");
//     return;
//   }

//   const newBalance = user.wallet_balance - payload.amount;
//   const newHistory = user.history || [];
//   newHistory.push({
//     type: 'data',
//     phone: payload.phone,
//     amount: payload.amount,
//     plan: payload.plan_text,
//     time: new Date().toISOString()
//   });

//   const { error } = await supabase.from('users').update({
//     wallet_balance: newBalance,
//     history: newHistory
//   }).eq('id', user.id);

//   if (error) {
//     alert("Data sent but failed to update wallet. Contact admin.");
//     return;
//   }

//   alert("Data purchase successful!");
//   localStorage.removeItem('pendingTransaction');
//   window.location.href = 'success.html';
// }


// document.getElementById('paynow').addEventListener('click', () => {
//   window.location.href = 'datapin.html';
// });
















































// import { getCurrentUser } from './user.js';

// console.log("✅ verifydatapin.js loaded correctly");

// const keypadButtons = document.querySelectorAll('.keypad button');
// let pinInput = '';

// // Pin input handling
// keypadButtons.forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const value = btn.textContent.trim();

//     if (value === 'Enter') {
//       if (pinInput.length === 4) {
//         await validateAndProcess(pinInput);
//       } else {
//         alert("Enter 4-digit PIN");
//       }
//     } else if (value === '←') {
//       pinInput = pinInput.slice(0, -1);
//     } else if (!isNaN(value)) {
//       if (pinInput.length < 4) pinInput += value;
//     }

//     const pinBoxes = document.querySelectorAll('.pin-boxes div');
//     pinBoxes.forEach((box, i) => {
//       box.textContent = pinInput[i] || '';
//     });
//   });
// });

// async function validateAndProcess(pin) {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   // TODO: Add retry counter here in the future
//   if (user.pin !== pin) {
//     alert("Incorrect PIN");
//     pinInput = '';
//     document.querySelectorAll('.pin-boxes div').forEach(box => box.textContent = '');
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('pendingTransaction'));
//   if (!payload || payload.type !== 'data') {
//     alert("No pending data transaction.");
//     window.location.href = "data.html";
//     return;
//   }

//   if (user.wallet_balance < payload.amount) {
//     alert("Insufficient balance");
//     return;
//   }

//   try {
//     // 1. Trigger data purchase via backend API
//     const purchaseRes = await fetch('http://localhost:5000/api/data', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         network: payload.network_id,
//         plan: payload.plan_id,
//         mobile_number: payload.phone,
//         Ported_number: true,
//         amount: payload.amount,
//         plan_label: payload.plan_label
//       })
//     });

//     const purchaseResult = await purchaseRes.json();
//     console.log("📡 Data API Response:", purchaseResult);

//     if (!purchaseRes.ok || purchaseResult.status !== "successful") {
//       await logTransaction(user.id, payload, 'failed');
//       alert("Transaction failed. Try again.");
//       window.location.href = 'datafailed.html';
//       return;
//     }

//     // 2. Update wallet and save transaction
//     const updateRes = await fetch('http://localhost:5000/api/update-wallet', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId: user.id,
//         amount: payload.amount,
//         transaction: {
//           id: purchaseResult.transaction_id,
//           type: 'data',
//           network: payload.network,
//           phone: payload.phone,
//           plan: payload.plan_label,
//           amount: payload.amount,
//           time: new Date().toISOString(),
//           status: 'successful'
//         }
//       })
//     });

//     const updateResult = await updateRes.json();

//     if (!updateRes.ok || !updateResult.success) {
//       alert("Data sent but wallet update failed. Contact support.");
//       return;
//     }

//     // 3. Save receipt to localStorage
//     localStorage.setItem('lastTransactionReceipt', JSON.stringify({
//       id: purchaseResult.transaction_id,
//       type: 'data',
//       network: payload.network,
//       phone: payload.phone,
//       plan: payload.plan_label,
//       amount: payload.amount,
//       time: new Date().toISOString(),
//       status: 'successful'
//     }));

//     localStorage.removeItem('pendingTransaction');
//     window.location.href = 'datasuccess.html';

//   } catch (error) {
//     console.error("❌ Unexpected error:", error);
//     alert("Something went wrong. Please try again.");
//     window.location.href = 'datafailed.html';
//   }
// }

// // Utility: Log failed transaction to backend
// async function logTransaction(userId, payload, status) {
//   const transaction = {
//     id: `TX-${Date.now()}`,
//     type: 'data',
//     network: payload.network,
//     phone: payload.phone,
//     plan: payload.plan_label,
//     amount: payload.amount,
//     time: new Date().toISOString(),
//     status
//   };

//   await fetch('http://localhost:5000/api/update-wallet', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       userId,
//       amount: 0,
//       transaction
//     })
//   });
// }






































// // Debit user before airtime is sent
// app.post('/api/debit-user', async (req, res) => {
//   const { userId, amount } = req.body;

//   try {
//     const { data: user, error: fetchError } = await supabase
//       .from('users')
//       .select('wallet_balance')
//       .eq('id', userId)
//       .single();

//     if (fetchError || !user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     if (user.wallet_balance < amount) {
//       return res.status(400).json({ error: 'Insufficient balance' });
//     }

//     const newBalance = user.wallet_balance - amount;

//     const { error: updateError } = await supabase
//       .from('users')
//       .update({ wallet_balance: newBalance })
//       .eq('id', userId);

//     if (updateError) {
//       return res.status(500).json({ error: 'Failed to debit wallet' });
//     }

//     return res.status(200).json({ success: true });

//   } catch (err) {
//     console.error("Debit error:", err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Refund user if airtime fails
// app.post('/api/refund-user', async (req, res) => {
//   const { userId, amount } = req.body;

//   try {
//     const { data: user, error: fetchError } = await supabase
//       .from('users')
//       .select('wallet_balance')
//       .eq('id', userId)
//       .single();

//     if (fetchError || !user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     const newBalance = user.wallet_balance + amount;

//     const { error: updateError } = await supabase
//       .from('users')
//       .update({ wallet_balance: newBalance })
//       .eq('id', userId);

//     if (updateError) {
//       return res.status(500).json({ error: 'Refund failed' });
//     }

//     return res.status(200).json({ success: true });

//   } catch (err) {
//     console.error("Refund error:", err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Wallet deduction and transaction logging
// app.post('/api/update-wallet', async (req, res) => {
//   const { userId, amount, transaction } = req.body;

//   try {
//     // 1. Get current user balance and history
//     const { data: user, error: fetchError } = await supabase
//       .from('users')
//       .select('wallet_balance, history')
//       .eq('id', userId)
//       .single();

//     if (fetchError || !user) {
//       console.error('User fetch error:', fetchError);
//       return res.status(400).json({ error: 'User not found' });
//     }

//     // 2. Check for sufficient balance
//     if (user.wallet_balance < amount) {
//       return res.status(400).json({ error: 'Insufficient balance' });
//     }

//     const newBalance = user.wallet_balance - amount;
//     const history = user.history || [];
//     history.push(transaction);

//     // 3. Update wallet and history
//     const { error: updateError } = await supabase
//       .from('users')
//       .update({
//         wallet_balance: newBalance,
//         history
//       })
//       .eq('id', userId);

//     if (updateError) {
//       console.error("Wallet update failed:", updateError);
//       return res.status(500).json({ error: 'Failed to update wallet' });
//     }

//     return res.status(200).json({ success: true });

//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });
