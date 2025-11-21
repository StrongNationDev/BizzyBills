// datasuccess.js
document.addEventListener('DOMContentLoaded', () => {
  const receipt = JSON.parse(localStorage.getItem('lastTransactionReceipt'));

  // If no receipt is found, redirect
  if (!receipt) {
    alert("No transaction receipt found.");
    window.location.href = "home.html";
    return;
  }

  // Populate Amount fields
  document.querySelectorAll('#AmountToCharge').forEach(el => {
    el.textContent = `₦${receipt.amount}`;
  });

  // Populate Destination number fields
  document.querySelectorAll('#DestinationNumber').forEach(el => {
    el.textContent = receipt.phone;
  });

  // Populate Data Plan
  const dataPlanElement = document.getElementById('data-plan');
  if (dataPlanElement) {
    dataPlanElement.querySelector('p').textContent = receipt.plan;
  }

  // Display date exactly as stored in localStorage
  const dateDetail = document.querySelector('.transaction-box .detail:last-child span');
  if (dateDetail) {
    // Shows exactly as saved: "2025-05-26T10:23:00Z"
    dateDetail.textContent = receipt.time;

    // Or, to make it cleaner (remove 'T' and 'Z'):
    // dateDetail.textContent = receipt.time.replace('T', ' ').replace('Z', '');
  }

  // Share receipt as image
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
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
  }
});




























// // datasuccess.js
// document.addEventListener('DOMContentLoaded', () => {
//   const receipt = JSON.parse(localStorage.getItem('lastTransactionReceipt'));

//   if (!receipt) {
//     alert("No transaction receipt found.");
//     window.location.href = "home.html";
//     return;
//   }

//   // Set dynamic content
//   document.querySelectorAll('#AmountToCharge').forEach(el => {
//     el.textContent = `₦${receipt.amount}`;
//   });

//   document.querySelectorAll('#DestinationNumber').forEach(el => {
//     el.textContent = receipt.phone;
//   });

//   document.getElementById('data-plan').querySelector('p').textContent = receipt.plan;

//   // Format and display date
//   const date = new Date(receipt.time);
//   const formattedDate = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString('en-NG', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   })}`;

//   const dateDetail = document.querySelector('.transaction-box .detail:last-child span');
//   if (dateDetail) dateDetail.textContent = formattedDate;

//   // Share receipt as image
//   const shareBtn = document.getElementById('share-btn');
//   shareBtn.addEventListener('click', async () => {
//     const container = document.querySelector('.container');
//     try {
//       const canvas = await html2canvas(container);
//       const link = document.createElement('a');
//       link.download = `receipt_${receipt.id || 'transaction'}.png`;
//       link.href = canvas.toDataURL('image/png');
//       link.click();
//     } catch (error) {
//       console.error("Error capturing receipt:", error);
//       alert("Failed to capture receipt. Try again.");
//     }
//   });
// });

