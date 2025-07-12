import { supabase, getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('Not logged in. Redirecting to login...');
    window.location.href = 'login.html';
    return;
  }

  const history = user.history || [];

  const container = document.querySelector('.transactions-body');

  if (!container) {
    console.error("Transaction container not found");
    return;
  }

  container.innerHTML = '';

  if (history.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = `Hi ${user.username}, it looks like you don't have any transactions yet. Start by funding your wallet!`;
    msg.style.padding = '1rem';
    container.appendChild(msg);
    return;
  }

  history.reverse().forEach(tx => {
    const card = document.createElement('div');
    card.className = 'transaction-card';

    let icon = 'icons/fund.png';
    let btnClass = 'blue';

    const details = tx.details?.toLowerCase() || '';

    if (details.includes('mtn')) {
      icon = 'icons/mtn.png';
      btnClass = 'yellow';
    } else if (details.includes('airtel')) {
      icon = 'icons/airtel.png';
      btnClass = 'red';
    } else if (details.includes('glo')) {
      icon = 'icons/glo.png';
      btnClass = 'green';
    } else if (details.includes('9mobile')) {
      icon = 'icons/9mobile.png';
      btnClass = 'purple';
    } else if (tx.type === 'wallet_funding') {
      icon = 'icons/fund.png';
      btnClass = 'blue';
    }

    card.innerHTML = `
      <div class="trans-icon"><img src="${icon}" alt="${tx.type}" /></div>
      <div class="trans-info">
        <p class="trans-title">${formatTitle(tx.type)}</p>
        <p class="trans-time">${formatDate(tx.date)}</p>
        <p class="trans-cost">Cost: <strong>₦${Number(tx.amount).toLocaleString()}</strong></p>
      </div>
      <div class="receipt-btn ${btnClass}" data-tx='${JSON.stringify(tx)}'>Open Receipt</div>
    `;

    container.appendChild(card);
  });

  // Handle click on any receipt
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('receipt-btn')) {
      const txData = e.target.getAttribute('data-tx');
      localStorage.setItem('selectedReceipt', txData);
      window.location.href = 'receipt.html';
    }
  });
});

function formatTitle(type) {
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