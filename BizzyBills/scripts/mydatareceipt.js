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
    return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'long', month: 'long', day: 'numeric' });
  };

  const amount = tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0;
  const phone = tx.phone ?? tx.provider_response?.mobile_number ?? '';
  const txId = tx.transaction_id ?? tx.id ?? tx.provider_response?.id ?? tx.provider_response?.ident ?? '';
  const plan = tx.plan ?? tx.provider_response?.plan_name ?? '';
  const dateVal = tx.created_at ?? tx.time ?? tx.timestamp ?? tx.provider_response?.create_date ?? '';

  // Fill status title
  document.querySelector('.status-title').textContent =
    tx.status === 'failed' ? 'Data Subscription Failed' : 'Data Subscription Successful';

  // Fill status message
  document.querySelector('.status-message').textContent =
    `Successfully purchased data subscription worth ${formatCurrency(amount)}${plan ? '/' + plan : ''} to ${phone}`;

  // Fill transaction details
  const details = document.querySelectorAll('.transaction-box .detail span:last-child');
  details[0].textContent = txId; // Transaction ID
  details[1].textContent = phone; // Destination
  details[2].textContent = 'Data Subscription'; // Transaction Type
  details[3].textContent = plan; // Plan
  details[4].textContent = formatCurrency(amount); // Amount
  details[5].textContent = formatDate(dateVal); // Date
});
