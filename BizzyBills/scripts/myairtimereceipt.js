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

  // Helper functions
  const formatCurrency = (n) => '₦' + Number(n).toLocaleString('en-NG');
  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'long', month: 'long', day: 'numeric' });
  };

  const amount = tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0;
  const phone = tx.phone ?? tx.provider_response?.mobile_number ?? '';
  const txId = tx.transaction_id ?? tx.id ?? tx.provider_response?.id ?? tx.provider_response?.ident ?? '';
  const dateVal = tx.created_at ?? tx.time ?? tx.timestamp ?? tx.provider_response?.create_date ?? '';

  // Fill status title
  document.querySelector('.status-title').textContent =
    tx.status === 'failed' ? 'Airtime Purchase Failed' : 'Airtime Purchase Successful';

  // Fill status message
  document.querySelector('.status-message').innerHTML =
    `You've successfully purchased airtime worth <pss id="AmountToCharge">${formatCurrency(amount)}</pss> to <pss id="DestinationNumber">${phone}</pss>`;

  // Fill transaction details
  const details = document.querySelectorAll('.transaction-box .detail span:last-child');
  details[0].textContent = txId; // Transaction ID
  details[1].textContent = phone; // Destination
  details[2].textContent = 'Airtime Purchase'; // Transaction Type
  details[3].textContent = formatCurrency(amount); // Amount
  details[4].textContent = formatDate(dateVal); // Date
});
