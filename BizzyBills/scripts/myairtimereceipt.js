// ./scripts/myairtimereceipt.js
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
    if (isNaN(date.getTime())) return d;
    return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Extract transaction values
  const amount = tx.amount ?? tx.original_amount ?? tx.provider_response?.plan_amount ?? 0;
  const phone = tx.phone ?? tx.provider_response?.mobile_number ?? '';
  const txId = tx.transaction_id ?? tx.id ?? tx.provider_response?.id ?? tx.provider_response?.ident ?? '';
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
});

// downkoad function
// Enable Download Receipt as PNG
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm';

document.getElementById('download-btn')?.addEventListener('click', async () => {
  const container = document.querySelector('.receipt-container') || document.body;

  // Add a quick "downloading" feedback
  const btn = document.getElementById('download-btn');
  btn.textContent = 'Downloading...';
  btn.disabled = true;

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution for clear PNG
      useCORS: true // Allows external images like logos
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'BizzyBills-Receipt.png';
    link.click();
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download receipt.');
  } finally {
    btn.textContent = 'Download';
    btn.disabled = false;
  }
});
