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

  if (user.account_number && user.account_number.length >= 10) {
    alert("You already have a virtual account.");
    btn.disabled = true;
    btn.textContent = "Account Already Created";
    return;
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.full_name || user.username || user.email.split('@')[0],
    phoneNumber: user.phone
  };


  try {
    const response = await fetch('https://bizzybillsng-servers.onrender.com/api/createVirtualAccount', {
    
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

    alert("🎉 Your Virtual account has been created successfully!");

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
