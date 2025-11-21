// history.js
import { getCurrentUser, supabase } from './user.js';

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₦0';
  const n = Number(amount);
  if (Number.isNaN(n)) return `₦${amount}`;
  return '₦' + n.toLocaleString('en-NG');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const opts = { hour: '2-digit', minute: '2-digit', weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleString('en-US', opts);
}

function normalizeNetwork(tx) {
  // Try common places where network info might live
  const maybe = (v) => (v === undefined || v === null) ? null : String(v);
  let net = maybe(tx.network) || maybe(tx.provider_response?.plan_network) || maybe(tx.provider_response?.network) || '';
  // provider_response.network might be numeric (1) — try to infer from other fields:
  if (!net || /^\d+$/.test(net)) {
    // try to find network name in plan or plan_name
    const planFields = (tx.plan || '') + ' ' + (tx.provider_response?.plan_name || '');
    if (/mtn/i.test(planFields) || /mtn/i.test(String(net))) net = 'mtn';
    else if (/glo/i.test(planFields) || /glo/i.test(String(net))) net = 'glo';
    else if (/airtel/i.test(planFields) || /airtel/i.test(String(net))) net = 'airtel';
    else if (/9mobile|etisalat/i.test(planFields) || /9mobile/i.test(String(net))) net = 'airtel';
  }
  return net.toLowerCase();
}

function getBoxIdForTx(tx) {
  const type = (tx.type || '').toLowerCase();
  if (type === 'deposit') return 'depositbox';

  if (type === 'airtime' || type === 'data') {
    const net = normalizeNetwork(tx);
    if (/mtn/.test(net)) return type === 'data' ? 'mtn_databox' : 'mtn_airtimebox';
    if (/glo/.test(net)) return type === 'data' ? 'glo_databox' : 'glo_airtimebox';
    if (/airtel/.test(net) || /9mobile|etisalat/.test(net)) return type === 'data' ? 'airtel_databox' : 'airtel_airtimebox';
  }

  return null; // unknown mapping
}

function getTitleForTx(tx) {
  const type = (tx.type || '').toLowerCase();
  const status = (tx.status || tx.provider_response?.Status || '').toLowerCase();
  const ok = (status === 'successful' || status === 'success' || status === 'ok' || !status);
  if (type === 'airtime') return ok ? 'Airtime Recharge Successful' : 'Airtime Recharge Failed';
  if (type === 'data') return ok ? 'Data Subscription Successful' : 'Data Subscription Failed';
  if (type === 'deposit') return ok ? 'Account Topup funding Successful' : 'Account Topup funding';
  return (type || 'Transaction').replace(/^\w/, s => s.toUpperCase());
}

async function fetchTransactionsFromCandidateTables(userId) {
  // The error you reported (42P01) means "table not found".
  // We'll try a few candidate table names and gracefully ignore table-not-found errors.
  const candidateTables = [
    'transactions',
    'user_transactions',
    'transaction_history',
    'history',
    'payments',
    'wallet_transactions'
  ];

  for (const t of candidateTables) {
    try {
      // try common column name user_id
      let { data, error } = await supabase
        .from(t)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) {
        console.warn(`table "${t}" returned error:`, error);
        // if table missing, skip to next candidate
        if (error.code === '42P01') continue;
        // some other error — skip this table as well
        continue;
      }
      if (Array.isArray(data) && data.length) return data;

      // If no rows returned, try common alternative column names
      const altCols = ['user', 'owner', 'account_id'];
      for (const c of altCols) {
        const { data: data2, error: err2 } = await supabase
          .from(t)
          .select('*')
          .eq(c, userId)
          .order('created_at', { ascending: false })
          .limit(500);
        if (err2) {
          if (err2.code === '42P01') break; // table missing; go to next candidate table
          continue;
        }
        if (Array.isArray(data2) && data2.length) return data2;
      }
    } catch (e) {
      console.warn(`fetch from ${t} threw`, e);
      continue;
    }
  }
  return null;
}

function tryParseJsonIfString(s) {
  if (!s || typeof s !== 'string') return null;
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { /* ignore */ }
  return null;
}

async function loadHistory() {
  const profile = await getCurrentUser();
  if (!profile) {
    console.error('No user logged in or could not fetch profile.');
    // optionally redirect to login page
    return;
  }

  let transactions = [];

  // 1) If profile already includes transactions/history as an array, use it
  if (Array.isArray(profile.transactions) && profile.transactions.length) transactions = profile.transactions;
  else if (Array.isArray(profile.history) && profile.history.length) transactions = profile.history;
  else if (Array.isArray(profile.transaction_history) && profile.transaction_history.length) transactions = profile.transaction_history;

  // 2) If profile has a JSON-string column that contains an array, try parse it
  if (!transactions.length) {
    for (const [k, v] of Object.entries(profile)) {
      if (Array.isArray(v) && v.length) {
        // pick the first array-of-objects we find that looks like transactions
        const isTxLike = v.some(it => it && (it.type || it.amount || it.time || it.timestamp));
        if (isTxLike) {
          transactions = v;
          break;
        }
      } else if (typeof v === 'string') {
        const parsed = tryParseJsonIfString(v);
        if (Array.isArray(parsed) && parsed.length) {
          const isTxLike = parsed.some(it => it && (it.type || it.amount || it.time || it.timestamp));
          if (isTxLike) {
            transactions = parsed;
            break;
          }
        }
      }
    }
  }

  // 3) Fallback: try candidate tables
  if (!transactions.length) {
    const fallback = await fetchTransactionsFromCandidateTables(profile.id);
    if (Array.isArray(fallback) && fallback.length) transactions = fallback;
  }

  // 4) If still nothing, inform the user and stop
  if (!Array.isArray(transactions) || !transactions.length) {
    console.warn('No transactions found in profile nor candidate tables.');
    // Optionally show a UI message here
    return;
  }

  // Template nodes (these are the static boxes you provided)
  const templates = {
    airtel_databox: document.getElementById('airtel_databox'),
    airtel_airtimebox: document.getElementById('airtel_airtimebox'),
    glo_airtimebox: document.getElementById('glo_airtimebox'),
    glo_databox: document.getElementById('glo_databox'),
    mtn_databox: document.getElementById('mtn_databox'),
    mtn_airtimebox: document.getElementById('mtn_airtimebox'),
    depositbox: document.getElementById('depositbox')
  };

  const container = document.querySelector('.transactions-body') || document.body;

  // Hide templates (we'll clone them)
  Object.values(templates).forEach(tpl => {
    if (tpl) tpl.style.display = 'none';
  });

  // For each transaction, find box template, clone and fill
  transactions.forEach(tx => {
    const boxId = getBoxIdForTx(tx);
    if (!boxId) return;
    const tpl = templates[boxId];
    if (!tpl) return; // no UI for this kind of tx

    const node = tpl.cloneNode(true);
    // remove the id so duplicates don't conflict
    node.removeAttribute('id');
    node.style.display = ''; // show clone

    // amount element (strong inside .trans-Amount)
    const amountStrong = node.querySelector('.trans-Amount strong') || node.querySelector('.trans-Amount');
    const amountValue = tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0;
    if (amountStrong) amountStrong.textContent = formatCurrency(amountValue);

    // time element
    const timeEl = node.querySelector('.trans-time');
    const timeValue = tx.created_at ?? tx.time ?? tx.timestamp ?? tx.provider_response?.create_date ?? tx.provider_response?.create_date;
    if (timeEl) timeEl.textContent = formatDate(timeValue);

    // title
    const titleEl = node.querySelector('.trans-title');
    if (titleEl) titleEl.textContent = getTitleForTx(tx);

    // store tx id on node for debugging
    const txId = tx.transaction_id ?? tx.id ?? tx.provider_response?.id ?? tx.provider_response?.ident ?? null;
    if (txId) node.dataset.txRef = txId;

    // wire the receipt button
    const receiptAnchor = node.querySelector('.receipt-btn a');
    if (receiptAnchor) {
      receiptAnchor.setAttribute('href', '#');
      receiptAnchor.addEventListener('click', (ev) => {
        ev.preventDefault();
        try {
          localStorage.setItem('selectedTransaction', JSON.stringify(tx));
        } catch (err) {
          console.error('Could not save selectedTransaction to localStorage', err);
        }
        // route by type
        const t = (tx.type || '').toLowerCase();
        if (t === 'airtime') window.location.href = 'myairtimereceipt.html';
        else window.location.href = 'mydatareceipt.html'; // data and deposit go to data receipt page by default
      });
    }

    container.appendChild(node);
  });
}

document.addEventListener('DOMContentLoaded', loadHistory);



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
















// for home.html page popualetion
// Add this new function at the very end of history.js

// async function loadRecentTransactionsForHome() {
//   const profile = await getCurrentUser();
//   if (!profile) {
//     console.error('No user logged in or could not fetch profile.');
//     return;
//   }

//   let transactions = [];

//   // 1) From profile arrays
//   if (Array.isArray(profile.transactions) && profile.transactions.length) transactions = profile.transactions;
//   else if (Array.isArray(profile.history) && profile.history.length) transactions = profile.history;
//   else if (Array.isArray(profile.transaction_history) && profile.transaction_history.length) transactions = profile.transaction_history;

//   // 2) Try parsing JSON strings in profile
//   if (!transactions.length) {
//     for (const [k, v] of Object.entries(profile)) {
//       if (Array.isArray(v) && v.length) {
//         const isTxLike = v.some(it => it && (it.type || it.amount || it.time || it.timestamp));
//         if (isTxLike) {
//           transactions = v;
//           break;
//         }
//       } else if (typeof v === 'string') {
//         const parsed = tryParseJsonIfString(v);
//         if (Array.isArray(parsed) && parsed.length) {
//           const isTxLike = parsed.some(it => it && (it.type || it.amount || it.time || it.timestamp));
//           if (isTxLike) {
//             transactions = parsed;
//             break;
//           }
//         }
//       }
//     }
//   }

//   // 3) Fallback: query candidate tables
//   if (!transactions.length) {
//     const fallback = await fetchTransactionsFromCandidateTables(profile.id);
//     if (Array.isArray(fallback) && fallback.length) transactions = fallback;
//   }

//   if (!Array.isArray(transactions) || !transactions.length) {
//     console.warn('No transactions found for recent history.');
//     return;
//   }

//   // Keep only the last 5
//   const recent5 = transactions
//     .slice() // copy array
//     .sort((a, b) => new Date(b.created_at || b.time || b.timestamp) - new Date(a.created_at || a.time || a.timestamp))
//     .slice(0, 5);

//   const container = document.getElementById('lastrecenthistory');
//   if (!container) return;

//   container.innerHTML = ''; // clear any existing

//   recent5.forEach(tx => {
//     const card = document.createElement('div');
//     card.classList.add('transaction-card');

//     // Icon based on network/type
//     let iconSrc = '';
//     const net = normalizeNetwork(tx);
//     if (/mtn/.test(net)) iconSrc = 'icons/mtn.png';
//     else if (/glo/.test(net)) iconSrc = 'icons/glo.png';
//     else if (/airtel/.test(net)) iconSrc = 'icons/airtel.png';
//     else iconSrc = 'icons/default.png';

//     const img = document.createElement('img');
//     img.src = iconSrc;
//     img.alt = net || 'Transaction';
//     img.classList.add('tx-icon');

//     const details = document.createElement('div');
//     details.classList.add('tx-details');

//     const title = document.createElement('strong');
//     title.textContent = getTitleForTx(tx);

//     const dateP = document.createElement('p');
//     dateP.textContent = formatDate(tx.created_at ?? tx.time ?? tx.timestamp);

//     const costP = document.createElement('p');
//     costP.innerHTML = `Cost: <strong>${formatCurrency(tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0)}</strong>`;

//     details.appendChild(title);
//     details.appendChild(dateP);
//     details.appendChild(costP);

//     const btn = document.createElement('button');
//     btn.classList.add('receipt-btn', 'yellow');
//     btn.textContent = 'Open Receipt';
//     btn.addEventListener('click', () => {
//       try {
//         localStorage.setItem('selectedTransaction', JSON.stringify(tx));
//       } catch (err) {
//         console.error('Could not save selectedTransaction to localStorage', err);
//       }
//       const t = (tx.type || '').toLowerCase();
//       if (t === 'airtime') window.location.href = 'myairtimereceipt.html';
//       else window.location.href = 'mydatareceipt.html';
//     });

//     card.appendChild(img);
//     card.appendChild(details);
//     card.appendChild(btn);

//     container.appendChild(card);
//   });
// }

// // If you want it to auto-load on home.html:
// if (document.getElementById('lastrecenthistory')) {
//   document.addEventListener('DOMContentLoaded', loadRecentTransactionsForHome);
// }
