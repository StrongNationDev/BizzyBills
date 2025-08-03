document.addEventListener("DOMContentLoaded", () => {
  const receipt = JSON.parse(localStorage.getItem('lastTransactionReceipt'));

  if (!receipt) {
    alert("No receipt data found.");
    window.location.href = "home.html";
    return;
  }

  document.getElementById('AmountToCharge').textContent = `₦${receipt.amount.toLocaleString()}`;
  document.querySelectorAll('#DestinationNumber').forEach(el => {
    el.textContent = receipt.phone;
  });

  const idElement = document.querySelector('.transaction-box .detail:nth-child(2) span:last-child');
  const dateElement = document.querySelector('.transaction-box .detail:nth-child(3) span:last-child');

  if (idElement) idElement.textContent = receipt.id;
  if (dateElement) {
    const date = new Date(receipt.time);
    const formatted = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toDateString()}`;
    dateElement.textContent = formatted;
  }
});



















// // scripts/receipt.js
// document.addEventListener("DOMContentLoaded", () => {
//   const transaction = JSON.parse(localStorage.getItem("latestTransaction"));

//   if (!transaction) {
//     alert("Transaction data not found.");
//     return;
//   }

//   document.querySelector("#AmountToCharge").textContent = `₦${transaction.amount}`;
//   document.querySelectorAll("#DestinationNumber").forEach(el => {
//     el.textContent = transaction.phone;
//   });

//   const transactionIdSpan = document.querySelector(".detail:nth-child(2) span:nth-child(2)");
//   const dateSpan = document.querySelector(".detail:nth-child(3) span:nth-child(2)");
//   const amountSpan = document.querySelector(".detail:nth-child(6) span:nth-child(2)");

//   transactionIdSpan.textContent = transaction.txn_id;
//   dateSpan.textContent = transaction.date;
//   amountSpan.textContent = `₦${transaction.amount}`;
// });
