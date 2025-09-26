// ./scripts/mydatareceipt.js
document.addEventListener('DOMContentLoaded', () => {
  const txRaw = localStorage.getItem('selectedTransaction');
  if (!txRaw) return;

  let tx;
  try {
    tx = JSON.parse(txRaw);
  } catch (e) {
    console.error('Error parsing transaction from localStorage', e);
    return;
  }

  // Helpers
  const formatCurrency = (n) => '₦' + Number(n).toLocaleString('en-NG');
  const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Extract transaction values safely
  const amount = tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0;
  const phone = tx.phone ?? tx.provider_response?.mobile_number ?? '';
  const txId = tx.transaction_id ?? tx.id ?? tx.provider_response?.id ?? tx.provider_response?.ident ?? '';
  const plan = tx.plan ?? tx.provider_response?.plan_name ?? '';
  const dateVal = tx.created_at ?? tx.time ?? tx.timestamp ?? tx.provider_response?.create_date ?? '';

  // Fill top card
  const amountEl = document.getElementById('AmountToCharge');
  if (amountEl) amountEl.textContent = formatCurrency(amount);

  const statusEl = document.querySelector('.receipt-status');
  if (statusEl) {
    if (/fail/i.test(tx.status)) {
      statusEl.textContent = '✖ Failed';
      statusEl.classList.remove('success');
      statusEl.classList.add('failed');
    } else {
      statusEl.textContent = '✔ Successful';
      statusEl.classList.remove('failed');
      statusEl.classList.add('success');
    }
  }

  // Fill transaction details
  document.getElementById('DestinationNumber').textContent = phone;
  document.getElementById('TransactionID').textContent = txId;
  document.getElementById('TransactionDate').textContent = formatDate(dateVal);

  // If you have plan name and type
  const planSpan = document.querySelector('.transaction-box .detail:nth-child(4) span:last-child');
  if (planSpan) planSpan.textContent = plan || 'N/A';
});

