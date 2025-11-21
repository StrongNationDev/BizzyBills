// ./scripts/homehistory.js
import { getCurrentUser } from './user.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHomeHistory();
});

async function loadHomeHistory() {
  const container = document.getElementById('lastrecenthistory');
  if (!container) return;

  container.innerHTML = `<p style="text-align:center; color:#7e7e7e; font-size:14px;">Loading...</p>`;

  try {
    const profile = await getCurrentUser();
    if (!profile) {
      container.innerHTML = `<p style="text-align:center; color:#7e7e7e; font-size:14px;">Please log in to see your transactions.</p>`;
      return;
    }

    // Extract transactions from profile (looks for profile.history and other candidate fields)
    let txs = extractTransactionsFromProfile(profile);

    if (!Array.isArray(txs) || txs.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#7e7e7e; font-size:14px;">No transactions yet.</p>`;
      return;
    }

    // normalize & sort by date (latest first) and keep only the last 10
    txs = txs.slice().sort((a, b) => {
      const ta = new Date(a.created_at || a.time || a.timestamp || a.date || 0).getTime();
      const tb = new Date(b.created_at || b.time || b.timestamp || b.date || 0).getTime();
      return tb - ta;
    }).slice(0, 10);

    // render
    container.innerHTML = '';
    txs.forEach(tx => {
      const isFailed = /fail/i.test(String(tx.status || ''));
      const formattedDate = formatDate(tx.created_at || tx.time || tx.timestamp || tx.date);
      const formattedAmount = formatAmount(tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0, tx.type);
      const icon = getTransactionIcon(tx);

      const article = document.createElement('article');
      article.className = 'transaction';
      article.setAttribute('aria-label', `Recent ${tx.type || 'transaction'} ${tx.status || ''}`);

      article.innerHTML = `
        <div class="transaction-left">
          <div class="transaction-icon">
            <img src="${icon}" alt="${tx.type || ''}" />
          </div>
          <div class="transaction-info">
            <div class="transaction-label">${capitalize(tx.type || tx.action || 'Transaction')}</div>
            <div class="transaction-date">${formattedDate}</div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount">${formattedAmount}</div>
          <div class="transaction-status ${isFailed ? 'failed' : 'success'}">
            ${isFailed ? 'Failed' : 'Successful'}
          </div>
        </div>
      `;

      // Click to open receipt (saves selectedTransaction to localStorage)
      article.addEventListener('click', () => {
        try { localStorage.setItem('selectedTransaction', JSON.stringify(tx)); } catch(e) { console.warn('Could not save selectedTransaction', e); }
        const t = (tx.type || '').toLowerCase();
        if (t === 'airtime') window.location.href = 'myairtimereceipt.html';
        else if (t === 'data') window.location.href = 'mydatareceipt.html';
        else window.location.href = 'mytransactionreceipt.html';
      });

      container.appendChild(article);
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    container.innerHTML = `<p style="text-align:center; color:red; font-size:14px;">Could not load transactions.</p>`;
  }
}

/* =========================
   Helpers
   ========================= */

function tryParseJsonIfString(s) {
  if (typeof s !== 'string') return s;
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function extractTransactionsFromProfile(profile) {
  // Candidate keys (your DB uses 'history' as you mentioned)
  const candidates = ['history', 'transactions', 'transaction_history', 'history_list', 'tx_history'];

  for (const key of candidates) {
    if (profile.hasOwnProperty(key)) {
      const v = profile[key];
      if (Array.isArray(v) && v.length) return v;
      if (typeof v === 'string') {
        const parsed = tryParseJsonIfString(v);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    }
  }

  // Fallback: scan profile for any array that looks like transaction objects
  for (const [k, v] of Object.entries(profile)) {
    if (Array.isArray(v) && v.length) {
      const looksLikeTx = v.some(it => it && (it.type || it.amount || it.time || it.timestamp || it.status));
      if (looksLikeTx) return v;
    } else if (typeof v === 'string') {
      const parsed = tryParseJsonIfString(v);
      if (Array.isArray(parsed) && parsed.some(it => it && (it.type || it.amount || it.time || it.timestamp || it.status))) {
        return parsed;
      }
    }
  }

  return [];
}

function formatAmount(amount, type) {
  const amt = Number(amount);
  if (Number.isNaN(amt)) return '-';
  const sign = (String(type || '').toLowerCase() === 'deposit') ? '+' : '-';
  try {
    const formatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${sign}₦${formatter.format(Math.abs(amt))}`;
  } catch (e) {
    // fallback
    return `${sign}₦${Math.abs(amt).toLocaleString()}${(amt % 1 === 0) ? '.00' : ''}`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
  const day = d.getDate();
  const hour = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  const sec = String(d.getSeconds()).padStart(2,'0');
  return `${months[d.getMonth()]} ${day}${ordinalSuffix(day)}, ${hour}:${min}:${sec}`;
}

function ordinalSuffix(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getTransactionIcon(tx) {
//   if (tx.network) {
//     const net = String(tx.network).toLowerCase();
//     if (net.includes('mtn')) return 'icons/airtime.png';
//     if (net.includes('glo')) return 'icons/airtime.png';
//     if (net.includes('airtel')) return 'icons/airtime.png';
//     if (net.includes('9mobile') || net.includes('etisalat')) return 'icons/9mobile.png';
//   }
  const type = String(tx.type || '').toLowerCase();
  switch (type) {
    case 'airtime': return 'icons/airtime.png';
    case 'data': return 'icons/data.png';
    case 'deposit': return 'icons/fund.png';
    case 'cable': return 'icons/cable.png';
    case 'electricity': return 'icons/electricity.png';
    default: return 'icons/transaction.png';
  }
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
