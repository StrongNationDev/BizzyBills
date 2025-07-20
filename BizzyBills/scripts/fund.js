import { getCurrentUser, supabase } from './user.js';

document.getElementById('getaccount').addEventListener('click', async () => {
  const btn = document.querySelector('#getaccount button');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  const user = await getCurrentUser();
  if (!user) {
    alert("You must be logged in to generate an account.");
    window.location.href = "login.html";
    return;
  }

  // ✅ Check if user already has a virtual account
  if (user.account_number && user.account_number.length >= 10) {
    alert("You already have a virtual account.");
    btn.disabled = true;
    btn.textContent = "Account Already Created";
    return;
  }

  // ✅ Send payload with `id`
  const payload = {
    id: user.id,
    email: user.email,
    name: user.full_name || user.username || user.email.split('@')[0],
    phoneNumber: user.phone
  };

  try {
    const response = await fetch('http://localhost:5000/api/createVirtualAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || result.status !== 'success') {
      console.error("❌ API Error:", result);
      alert("Failed to create virtual account. Try again later.");
      btn.disabled = false;
      btn.textContent = 'Generate Virtual Account';
      return;
    }

    const bankAccount = result.bankAccounts?.[0];
    const accountNumber = bankAccount?.accountNumber;

    if (!accountNumber) {
      alert("Account created but no account number was returned.");
      console.error("❌ No account number in API response.");
      btn.disabled = false;
      btn.textContent = 'Generate Virtual Account';
      return;
    }

    alert("🎉 Virtual account created successfully!");

    // ✅ Update UI
    btn.disabled = true;
    btn.textContent = "Account Already Created";

    const accNumEl = document.querySelector('.account-number');
    if (accNumEl) accNumEl.textContent = accountNumber;

  } catch (err) {
    console.error("❌ Network/server error:", err);
    alert("A network or server error occurred. Please try again later.");
    btn.disabled = false;
    btn.textContent = 'Generate Virtual Account';
  }
});







// import { getCurrentUser, supabase } from './user.js';

// document.getElementById('getaccount').addEventListener('click', async () => {
//   const btn = document.querySelector('#getaccount button');
//   btn.disabled = true;
//   btn.textContent = 'Processing...';

//   const user = await getCurrentUser();
//   if (!user) {
//     alert("You must be logged in to generate an account.");
//     window.location.href = "login.html";
//     return;
//   }

//   // Check if user already has a virtual account
//   if (user.account_number && user.account_number.length >= 10) {
//     alert("You already have a virtual account.");
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";
//     return;
//   }

//   // Prepare payload using email (used by server.js)
//   const payload = {
//     email: user.email,
//     name: user.full_name || user.username || user.email.split('@')[0],
//     phoneNumber: user.phone,
//     user_id: user.id
//   };

//   try {
//     const response = await fetch('http://localhost:5000/api/createVirtualAccount', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     });

//     const result = await response.json();

//     if (!response.ok || result.status !== 'success') {
//       console.error("API Error:", result);
//       alert("Failed to create virtual account. Try again later.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     const bankAccount = result.bankAccounts?.[0];
//     const accountNumber = bankAccount?.accountNumber;
//     const accountType = bankAccount?.accountType || 'regular';

//     if (!accountNumber) {
//       console.error("No account number in response.");
//       alert("Virtual account created, but no account number returned.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     // Add to user history
//     const historyItem = {
//       type: 'virtual_account',
//       title: '🎉 Virtual Account Created',
//       message: 'Your BizzyBills top-up account has been created successfully!',
//       time: new Date().toISOString()
//     };

//     // Save to Supabase database
//     const { error: supabaseError } = await supabase.from('users')
//       .update({
//         account_number: accountNumber,
//         account_type: accountType,
//         history: [...(user.history || []), historyItem]
//       })
//       .eq('id', user.id);

//     if (supabaseError) {
//       console.error("Supabase update failed:", supabaseError);
//       alert("Account created, but failed to save to database.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     alert("Virtual account created successfully!");

//     // Update UI
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";

//     const accNumEl = document.querySelector('.account-number');
//     if (accNumEl) accNumEl.textContent = accountNumber;

//   } catch (err) {
//     console.error("Network/server error:", err);
//     alert("A network or server error occurred. Please try again later.");
//     btn.disabled = false;
//     btn.textContent = 'Generate Virtual Account';
//   }
// });
















// import { getCurrentUser, supabase } from './user.js';

// document.getElementById('getaccount').addEventListener('click', async () => {
//   const btn = document.querySelector('#getaccount button');
//   btn.disabled = true;
//   btn.textContent = 'Processing...';

//   const user = await getCurrentUser();
//   if (!user) {
//     alert("You must be logged in to generate an account.");
//     window.location.href = "login.html";
//     return;
//   }

//   if (user.account_number && user.account_number.length >= 10) {
//     alert("You already have a virtual account.");
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";
//     return;
//   }

//   const payload = {
//     email: user.email,
//     name: user.full_name || user.username || user.email.split('@')[0],
//     phoneNumber: user.phone,
//     user_id: user.id
//   };

//   try {
//     const response = await fetch('http://localhost:5000/api/createVirtualAccount', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     });

//     const result = await response.json();

//     if (!response.ok || result.status !== 'success') {
//       console.error("API Error:", result);
//       alert("Failed to create virtual account. Try again later.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     const accountNumber = result.bankAccounts?.[0]?.accountNumber;
//     const accountType = result.bankAccounts?.[0]?.accountType || 'regular';

//     if (!accountNumber) {
//       console.error("No account number found in API response.");
//       alert("Virtual account created, but no account number returned.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     // Add to user history
//     const historyItem = {
//       type: 'virtual_account',
//       title: '🎉 Congratulations on your virtual account!',
//       message: 'You have successfully generated a virtual account number that you will use to top-up your BizzyBills account. Now go ahead and start buying!',
//       time: new Date().toISOString()
//     };

//     const { error: supabaseError } = await supabase.from('users')
//       .update({
//         account_number: accountNumber,
//         account_type: accountType,
//         history: [...(user.history || []), historyItem]
//       })
//       .eq('id', user.id);

//     if (supabaseError) {
//       console.error("Supabase update failed:", supabaseError);
//       alert("Account created, but failed to save to database.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     alert("Virtual account created successfully!");

//     // Update UI
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";

//     const accNumEl = document.querySelector('.account-number');
//     if (accNumEl) accNumEl.textContent = accountNumber;

//   } catch (err) {
//     console.error("Network or server error:", err);
//     alert("A network or server error occurred. Please try again later.");
//     btn.disabled = false;
//     btn.textContent = 'Generate Virtual Account';
//   }
// });

























// // ✅ fund.js
// import { getCurrentUser, supabase } from './user.js';

// document.getElementById('getaccount').addEventListener('click', async () => {
//   const btn = document.querySelector('#getaccount button');
//   btn.disabled = true;
//   btn.textContent = 'Processing...';

//   const user = await getCurrentUser();
//   if (!user) {
//     alert("You must be logged in to generate an account.");
//     window.location.href = "login.html";
//     return;
//   }

//   if (user.account_number && user.account_number.length >= 10) {
//     alert("You already have a virtual account.");
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";
//     return;
//   }

//   const payload = {
//     email: user.email,
//     name: user.full_name || user.username,
//     phoneNumber: user.phone,
//     bankCode: ['20946'],
//     businessId: 'bd5c47afecef6c42c81e4760ca960b71c16d6783'
//   };

//   try {
//     const response = await fetch('http://localhost:5000/api/createVirtualAccount', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     });

//     const result = await response.json();

//     if (result.status !== 'success') {
//       console.error(result);
//       alert("Failed to create virtual account. Try again later.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     const accountNumber = result.bankAccounts?.[0]?.accountNumber;
//     if (!accountNumber) {
//       console.error("No account number found in API response.");
//       alert("Virtual account creation succeeded, but no account number returned.");
//       btn.disabled = false;
//       btn.textContent = 'Generate Virtual Account';
//       return;
//     }

//     const historyItem = {
//       type: 'virtual_account',
//       title: '🎉 Congratulations on your virtual account!',
//       message: 'You have successfully generated a virtual account number that you will use to top-up your BizzyBills account. Now go ahead and start buying!',
//       time: new Date().toISOString()
//     };

//     console.log("About to update Supabase with:", {
//       id: user.id,
//       account_number: accountNumber,
//       historyItem,
//     });

//     const { error } = await supabase.from('users')
//       .update({
//         account_number: accountNumber,
//         history: [...(user.history || []), historyItem]
//       })
//       .eq('id', user.id);

//     if (error) {
//       console.error("Failed to update Supabase:", error);
//       alert("Account created, but failed to save to database.");
//       return;
//     }

//     alert("Virtual account created successfully!");

//     // Update UI
//     btn.disabled = true;
//     btn.textContent = "Account Already Created";

//     const accNumEl = document.querySelector('.account-number');
//     if (accNumEl) accNumEl.textContent = accountNumber;

//   } catch (err) {
//     console.error("Network or API error:", err);
//     alert("An error occurred. Please check your network or try again later.");
//     btn.disabled = false;
//     btn.textContent = 'Generate Virtual Account';
//   }
// });
