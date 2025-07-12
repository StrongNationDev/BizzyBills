import { supabase, getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('balance-amount').textContent = `₦${user.wallet_balance.toLocaleString()}`;
  document.querySelector('.welcome-text strong').textContent = user.username;

  const transactionsContainer = document.querySelector('.transactions');

  transactionsContainer.innerHTML = `
    <div class="transaction-header">
      <p class="section-title">Transactions</p>
      <a href="history.html" class="view-all">View all <img src="icons/arrow.png" alt="Arrow" /></a>
    </div>
  `;

  const history = user.history || [];

  if (history.length === 0) {
    const message = document.createElement('p');
    const messageBox = document.createElement('div');
        messageBox.className = 'empty-history';

        messageBox.innerHTML = `
        <h3>Hello ${user.username},</h3>
        <p class="info">It seems you are yet to start buying here.<br> 
            Do well by funding your account today and see the wonders we have prepared for you.</p>
        `;

        transactionsContainer.appendChild(messageBox);

    message.style.padding = '1rem';
    transactionsContainer.appendChild(message);
  } else {
    history.reverse().slice(0, 5).forEach(tx => {
      const card = document.createElement('div');
      card.className = 'transaction-card';

      let icon = 'icons/transaction.png';
      if (tx.details?.toLowerCase().includes('mtn')) icon = 'icons/mtn.png';
      else if (tx.details?.toLowerCase().includes('airtel')) icon = 'icons/airtel.png';
      else if (tx.details?.toLowerCase().includes('glo')) icon = 'icons/glo.png';

      card.innerHTML = `
        <img src="${icon}" class="tx-icon" />
        <div class="tx-details">
          <strong>${tx.type.replace(/_/g, ' ').toUpperCase()}</strong>
          <p>${new Date(tx.date).toLocaleString()}</p>
          <p>Cost: <strong>₦${tx.amount.toLocaleString()}</strong></p>
        </div>
        <button class="receipt-btn">Open Receipt</button>
      `;

      transactionsContainer.appendChild(card);
    });
  }
});






// screen loader
window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('loading-overlay').classList.add('fade-out');
});
