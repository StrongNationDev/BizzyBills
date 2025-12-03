import { getCurrentUser, supabase } from './user.js';


document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    showAlert('You must be logged in to view your virtual account.');
    window.location.href = 'login.html';
    return;
  }

  const nameElement = document.querySelector('.account-name');
  const numberElement = document.querySelector('.account-number');

  nameElement.textContent = user.full_name || 'Your Name';
  numberElement.textContent = user.account_number || '0000000000';
});

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    showAlert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('loading-overlay').classList.add('fade-out');
});

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    showAlert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }
document.getElementById('loading-overlay').classList.add('fade-out');
});


// Other code related to fund.js
document.getElementById('getaccount').addEventListener('click', async () => {
  const btn = document.querySelector('#getaccount button');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  const user = await getCurrentUser();
  if (!user) {
    showAlert("You must be logged in to generate an account.");
    window.location.href = "login.html";
    return;
  }

  if (user.account_number && user.account_number.length >= 10) {
    showAlert("You already have a virtual account.");
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
      showAlert("Failed to create virtual account. Try again later.");
      btn.disabled = false;
      btn.textContent = 'Generate Virtual Account';
      return;
    }

    const bankAccount = result.bankAccounts?.[0];
    const accountNumber = bankAccount?.accountNumber;

    if (!accountNumber) {
      showAlert("Account created but no account number was returned.");
      console.error("❌ No account number in API response.");
      btn.disabled = false;
      btn.textContent = 'Generate Virtual Account';
      return;
    }

    showAlert("🎉 Your Virtual account has been created successfully!");

    // ✅ Update UI
    btn.disabled = true;
    btn.textContent = "Account Already Created";

    const accNumEl = document.querySelector('.account-number');
    if (accNumEl) accNumEl.textContent = accountNumber;

    // ✅ Save proper success message to database
    const { error } = await supabase
      .from('users')
      .update({
        account_number: accountNumber,
        virtual_account_status: "Virtual Account Successfully Generated"
      })
      .eq('id', user.id);

    if (error) {
      console.error("❌ Failed to update account status:", error);
    }

  } catch (err) {
    console.error("❌ Network/server error:", err);
    showAlert("A network or server error occurred. Please try again later.");
    btn.disabled = false;
    btn.textContent = 'Generate Virtual Account';
  }
});

    // "Copy Detail" button copies account name and number
    document.getElementById('copyDetailBtn').onclick = function() {
      const name = document.querySelector('.account-name').textContent;
      const number = document.querySelector('.account-number').textContent;
      const full = `${name}\n${number}`;
      navigator.clipboard.writeText(full);
      this.textContent = "Copied!";
      setTimeout(() => { this.textContent = "Copy Detail"; }, 1600);
    };