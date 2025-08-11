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


// the sharing button functionality
document.addEventListener('DOMContentLoaded', () => {
  const shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        scale: 2
      });

      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'receipt.png', { type: 'image/png' });

      // Check if sharing files is supported
      const canShareFiles = navigator.share && navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: 'My Receipt',
          text: 'Here is my receipt'
        });
      } else {
        // Always fallback to download on desktop
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'receipt.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Receipt saved to your device.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        alert('Could not share the receipt.');
      }
    }
  });

  }
});
