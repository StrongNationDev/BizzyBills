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

    const type = (tx.type || '').toLowerCase();
    const network = (tx.network || '').toLowerCase();
    const details = (tx.details || '').toLowerCase();

    // Determine icon and alt
    let icon = 'icons/fund.png';
    let altText = 'Funding';
    let btnClass = 'blue';
    let label = 'Account Funding';

    if (type === 'deposit' || type === 'wallet_funding') {
      icon = 'icons/fund.png';
      altText = 'Funding';
      label = 'Account Funding';
      btnClass = 'blue';
    } else if (type === 'airtime') {
      icon = getIcon(network || details);
      altText = capitalize(network || getAltFromDetails(details));
      label = 'Airtime Recharge Card';
      btnClass = 'green';
    } else if (type === 'data') {
      icon = getIcon(network || details);
      altText = capitalize(network || getAltFromDetails(details));
      label = 'Data Subscription';
      btnClass = 'red';
    }

    // Choose date
    const time = tx.time || tx.timestamp || tx.date || new Date().toISOString();
    const formattedDate = formatDate(time);

    const formattedAmount = Number(tx.amount || 0).toLocaleString();

    card.innerHTML = `
      <div class="trans-icon"><img src="${icon}" alt="${altText}" /></div>
      <div class="trans-info">
        <p class="trans-title">${label}</p>
        <p class="trans-time">${formattedDate}</p>
        <p class="trans-cost">Cost: <strong>₦${formattedAmount}</strong></p>
      </div>
      <div class="receipt-btn ${btnClass}" data-tx='${JSON.stringify(tx)}'>Open Receipt</div>
    `;

    container.appendChild(card);
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('receipt-btn')) {
      const txData = e.target.getAttribute('data-tx');
      localStorage.setItem('selectedReceipt', txData);
      window.location.href = 'receipt.html';
    }
  });
});

// Utility Functions

function getIcon(source) {
  source = source.toLowerCase();
  if (source.includes('mtn')) return 'icons/mtn.png';
  if (source.includes('airtel')) return 'icons/airtel.png';
  if (source.includes('glo')) return 'icons/glo.png';
  if (source.includes('9mobile') || source.includes('etisalat')) return 'icons/9mobile.png';
  return 'icons/fund.png';
}

function getAltFromDetails(details) {
  if (details.includes('mtn')) return 'MTN';
  if (details.includes('glo')) return 'GLO';
  if (details.includes('airtel')) return 'Airtel';
  if (details.includes('9mobile')) return '9mobile';
  return 'Funding';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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