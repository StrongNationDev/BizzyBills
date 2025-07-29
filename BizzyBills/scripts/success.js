// scripts/success.js

document.addEventListener("DOMContentLoaded", () => {
  const transaction = JSON.parse(localStorage.getItem("lastTransactionReceipt"));

  if (!transaction) {
    alert("No receipt found.");
    return;
  }

  // Display the transaction info
  document.querySelector(".status-message").textContent =
    `Successfully purchased data subscription worth ₦${transaction.amount} (${transaction.plan}) to ${transaction.phone}`;

  const details = document.querySelectorAll(".transaction-box .detail");

  details[0].querySelector("span:nth-child(2)").textContent = transaction.id;
  details[1].querySelector("span:nth-child(2)").textContent = new Date(transaction.time).toLocaleString();
  details[2].querySelector("span:nth-child(2)").textContent = transaction.phone;
  details[3].querySelector("span:nth-child(2)").textContent = "Data Subscription";
  details[4].querySelector("span:nth-child(2)").textContent = `₦${transaction.amount}`;
  details[5].querySelector("span:nth-child(2)").textContent = transaction.plan;

  // Add download functionality
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const receipt = document.getElementById("receipt-container");
      if (!receipt) {
        alert("Receipt container not found.");
        return;
      }

      html2canvas(receipt, {
        scale: 2,
        backgroundColor: "#fff"
      }).then((canvas) => {
        const ctx = canvas.getContext("2d");

        // Add watermark
        ctx.font = "20px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.textAlign = "right";
        ctx.fillText("BizzyBillsng", canvas.width - 20, canvas.height - 20);

        // Download as image
        const link = document.createElement("a");
        link.download = "BizzyBillsng_Receipt.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  }
});












// import { getCurrentUser } from './user.js';

// (async () => {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert("User not logged in");
//     window.location.href = "login.html";
//     return;
//   }

//   const payload = JSON.parse(localStorage.getItem('lastTransaction'));
//   if (!payload) {
//     alert("No completed transaction data found.");
//     window.location.href = "home.html";
//     return;
//   }

//   document.querySelector(".status-message").textContent = 
//     `Successfully purchased data subscription worth ₦${payload.amount}/${payload.plan_name} to ${payload.phone}`;

//   const txId = payload.transaction_id || Math.floor(Math.random() * 1e12).toString();
//   const now = new Date();
//   const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
//                   `, ${now.getDate()}${getOrdinal(now.getDate())}, ${now.getFullYear()}`;

//   document.querySelector(".transaction-box .detail:nth-child(2) span:last-child").textContent = txId;
//   document.querySelector(".transaction-box .detail:nth-child(3) span:last-child").textContent = dateStr;
//   document.querySelector(".transaction-box .detail:nth-child(4) span:last-child").textContent = payload.phone;
//   document.querySelector(".transaction-box .detail:nth-child(5) span:last-child").textContent = "Data Subscription";
//   document.querySelector(".transaction-box .detail:nth-child(6) span:last-child").textContent = `₦${payload.amount}`;
//   document.querySelector(".transaction-box .detail:nth-child(7) span:last-child").textContent = `${payload.plan_name}`;

//   localStorage.removeItem('lastTransaction');
// })();

// function getOrdinal(n) {
//   const s = ["th", "st", "nd", "rd"], v = n % 100;
//   return s[(v - 20) % 10] || s[v] || s[0];
// }
