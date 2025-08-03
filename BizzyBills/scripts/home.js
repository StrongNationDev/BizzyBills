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
// const transactionsContainer = document.querySelector('.transactions-body');

  if (!transactionsContainer) {
    console.error("Container for transactions not found.");
    return;
  }

  transactionsContainer.innerHTML = '';

  if (history.length === 0) {
    const messageBox = document.createElement('div');
    messageBox.className = 'empty-history';

    messageBox.innerHTML = `
      <h3>Hello ${user.username},</h3>
      <p class="info">It seems you are yet to start buying here.<br> 
          Do well by funding your account today and see the wonders we have prepared for you.</p>
    `;

    transactionsContainer.appendChild(messageBox);
  } else {
    history
      .reverse()
      .slice(0, 5)
      .forEach(tx => {
        const card = document.createElement('div');
        card.className = 'transaction-card';

        const type = (tx.type || '').toLowerCase();
        const network = (tx.network || '').toLowerCase();
        const details = (tx.details || '').toLowerCase();
        const time = tx.time || tx.timestamp || tx.date || new Date().toISOString();

        let icon = 'icons/transaction.png';
        let alt = 'Transaction';

        if (type === 'deposit' || type === 'wallet_funding') {
          icon = 'icons/fund.png';
          alt = 'Funding';
        } else if (network.includes('mtn') || details.includes('mtn')) {
          icon = 'icons/mtn.png';
          alt = 'MTN';
        } else if (network.includes('airtel') || details.includes('airtel')) {
          icon = 'icons/airtel.png';
          alt = 'Airtel';
        } else if (network.includes('glo') || details.includes('glo')) {
          icon = 'icons/glo.png';
          alt = 'GLO';
        } else if (network.includes('9mobile') || details.includes('9mobile')) {
          icon = 'icons/9mobile.png';
          alt = '9mobile';
        }

        card.innerHTML = `
          <img src="${icon}" class="tx-icon" alt="${alt}" />
          <div class="tx-details">
            <strong>${formatTitle(tx.type)}</strong>
            <p>${formatDate(time)}</p>
            <p>Cost: <strong>₦${Number(tx.amount).toLocaleString()}</strong></p>
          </div>
          <button class="receipt-btn" data-tx='${JSON.stringify(tx)}'>Open Receipt</button>
        `;

        transactionsContainer.appendChild(card);
      });

    // Click handler for any receipt buttons
    transactionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('receipt-btn')) {
        const txData = e.target.getAttribute('data-tx');
        localStorage.setItem('selectedReceipt', txData);
        window.location.href = 'receipt.html';
      }
    });
  }

  // Helper functions
  function formatTitle(type) {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long',
      day: 'numeric',
      month: 'long'
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
