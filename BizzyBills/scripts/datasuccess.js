// datasuccess.js
document.addEventListener('DOMContentLoaded', () => {
  const receipt = JSON.parse(localStorage.getItem('lastTransactionReceipt'));

  if (!receipt) {
    alert("No transaction receipt found.");
    window.location.href = "home.html";
    return;
  }

  // Set dynamic content
  document.querySelectorAll('#AmountToCharge').forEach(el => {
    el.textContent = `₦${receipt.amount}`;
  });

  document.querySelectorAll('#DestinationNumber').forEach(el => {
    el.textContent = receipt.phone;
  });

  document.getElementById('data-plan').querySelector('p').textContent = receipt.plan;

  // Format and display date
  const date = new Date(receipt.time);
  const formattedDate = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })}`;

  const dateDetail = document.querySelector('.transaction-box .detail:last-child span');
  if (dateDetail) dateDetail.textContent = formattedDate;

  // Share receipt as image
  const shareBtn = document.getElementById('share-btn');
  shareBtn.addEventListener('click', async () => {
    const container = document.querySelector('.container');
    try {
      const canvas = await html2canvas(container);
      const link = document.createElement('a');
      link.download = `receipt_${receipt.id || 'transaction'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error capturing receipt:", error);
      alert("Failed to capture receipt. Try again.");
    }
  });
});































// document.addEventListener('DOMContentLoaded', () => {
//   const data = JSON.parse(localStorage.getItem('lastDataSuccess'));

//   if (!data) {
//     alert("No recent transaction found.");
//     window.location.href = "home.html";
//     return;
//   }

//   document.querySelectorAll('#AmountToCharge').forEach(el => {
//     el.textContent = `₦${data.amount}`;
//   });

//   document.querySelectorAll('#DestinationNumber').forEach(el => {
//     el.textContent = data.phone;
//   });

//   document.querySelector('.transaction-box .detail:nth-child(4) p').textContent = `${data.quality} - ${data.period}`;
//   document.querySelector('.transaction-box .detail:nth-child(5) span').textContent = data.date;
// });
