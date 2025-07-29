// scripts/receipt.js
document.addEventListener("DOMContentLoaded", () => {
  const transaction = JSON.parse(localStorage.getItem("latestTransaction"));

  if (!transaction) {
    alert("Transaction data not found.");
    return;
  }

  document.querySelector("#AmountToCharge").textContent = `₦${transaction.amount}`;
  document.querySelectorAll("#DestinationNumber").forEach(el => {
    el.textContent = transaction.phone;
  });

  const transactionIdSpan = document.querySelector(".detail:nth-child(2) span:nth-child(2)");
  const dateSpan = document.querySelector(".detail:nth-child(3) span:nth-child(2)");
  const amountSpan = document.querySelector(".detail:nth-child(6) span:nth-child(2)");

  transactionIdSpan.textContent = transaction.txn_id;
  dateSpan.textContent = transaction.date;
  amountSpan.textContent = `₦${transaction.amount}`;
});
