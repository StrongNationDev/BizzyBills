document.addEventListener("DOMContentLoaded", () => {
  const receipt = JSON.parse(localStorage.getItem("lastTransactionReceipt"));

  if (!receipt) {
    alert("No transaction data found.");
    window.location.href = "home.html";
    return;
  }

  // Amount
  document.querySelectorAll("#AmountToCharge").forEach(el => {
    el.textContent = `₦${receipt.amount}`;
  });

  // Destination
  document.querySelectorAll("#DestinationNumber").forEach(el => {
    el.textContent = receipt.phone;
  });

  // Date (formatted)
  const dateEl = document.getElementById("currentdate");
  if (dateEl) {
    const date = new Date(receipt.time);
    if (!isNaN(date.getTime())) {
      const options = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      const formatted = date.toLocaleString("en-US", options);
      const day = date.getDate();
      const suffix =
        day % 10 === 1 && day !== 11 ? "st" :
        day % 10 === 2 && day !== 12 ? "nd" :
        day % 10 === 3 && day !== 13 ? "rd" : "th";
      const finalDate = formatted.replace(String(day), `${day}${suffix}`);
      dateEl.textContent = finalDate;
    } else {
      dateEl.textContent = new Date().toLocaleString("en-US");
    }
  }

  // Share button functionality
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (shareBtn.disabled) return;
      shareBtn.disabled = true;
      shareBtn.textContent = "Sharing...";
      try {
        await captureAndShareReceipt();
      } catch (err) {
        console.error("Share failed:", err);
        alert("Could not share receipt. Try again or take a screenshot.");
      } finally {
        shareBtn.disabled = false;
        shareBtn.textContent = "Share Receipt";
      }
    });

    if (!(navigator.canShare && navigator.canShare({ files: [new File([], '')] }))) {
      shareBtn.style.display = 'none';
    }
  }

  async function captureAndShareReceipt() {
    const container = document.querySelector(".container");
    const watermark = document.createElement("div");
    watermark.textContent = "BIZZYBILLSNG";
    watermark.style.position = "absolute";
    watermark.style.bottom = "10px";
    watermark.style.right = "10px";
    watermark.style.fontSize = "18px";
    watermark.style.opacity = "0.5";
    watermark.style.fontWeight = "bold";
    watermark.style.color = "#333";
    watermark.style.zIndex = "9999";
    container.appendChild(watermark);

    const canvas = await html2canvas(container, {
      backgroundColor: "#fff",
      useCORS: true,
      scale: 2
    });

    container.removeChild(watermark);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'receipt.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Airtime Receipt',
        text: 'See my BizzyBillsNG airtime receipt.',
        files: [file]
      });
    } else {
      const link = document.createElement("a");
      link.download = "receipt.png";
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  }
});












































// // airtimesuccess.js
// document.addEventListener("DOMContentLoaded", () => {
//   const receipt = JSON.parse(localStorage.getItem("lastTransactionReceipt"));

//   // Redirect if no data
//   if (!receipt) {
//     alert("No transaction data found.");
//     window.location.href = "home.html";
//     return;
//   }

//   // Populate amount
//   document.querySelectorAll("#AmountToCharge").forEach(el => {
//     el.textContent = `₦${receipt.amount}`;
//   });

//   // Populate destination number
//   document.querySelectorAll("#DestinationNumber").forEach(el => {
//     el.textContent = receipt.phone;
//   });

//   // Show date exactly as stored
//   const dateEl = document.querySelector(".transaction-box .detail:nth-child(4) span:last-child");
//   if (dateEl) {
//     // Exact stored format: e.g. "2025-05-26T10:23:00Z"
//     dateEl.textContent = receipt.time;

//     // Or cleaner format without T/Z:
//     // dateEl.textContent = receipt.time.replace("T", " ").replace("Z", "");
//   }

//   // Share button functionality
//   const shareBtn = document.getElementById("share-btn");
//   if (shareBtn) {
//     shareBtn.addEventListener("click", async () => {
//       if (shareBtn.disabled) return;

//       shareBtn.disabled = true;
//       shareBtn.textContent = "Sharing...";

//       try {
//         await captureAndShareReceipt();
//       } catch (err) {
//         console.error("Share failed:", err);
//         alert("Could not share receipt. Try again or take a screenshot.");
//       } finally {
//         shareBtn.disabled = false;
//         shareBtn.textContent = "Share Receipt";
//       }
//     });

//     // Hide share button if browser can't share files
//     if (!(navigator.canShare && navigator.canShare({ files: [new File([], '')] }))) {
//       shareBtn.style.display = 'none';
//     }
//   }

//   // Capture and share receipt
//   async function captureAndShareReceipt() {
//     const container = document.querySelector(".container");

//     // Add watermark
//     const watermark = document.createElement("div");
//     watermark.textContent = "BIZZYBILLSNG";
//     watermark.style.position = "absolute";
//     watermark.style.bottom = "10px";
//     watermark.style.right = "10px";
//     watermark.style.fontSize = "18px";
//     watermark.style.opacity = "0.5";
//     watermark.style.fontWeight = "bold";
//     watermark.style.color = "#333";
//     watermark.style.zIndex = "9999";
//     container.appendChild(watermark);

//     // Capture screenshot
//     const canvas = await html2canvas(container, {
//       backgroundColor: "#fff",
//       useCORS: true,
//       scale: 2
//     });

//     container.removeChild(watermark);

//     const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
//     const file = new File([blob], 'receipt.png', { type: 'image/png' });

//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       await navigator.share({
//         title: 'Airtime Receipt',
//         text: 'See my BizzyBillsNG airtime receipt.',
//         files: [file]
//       });
//     } else {
//       const link = document.createElement("a");
//       link.download = "receipt.png";
//       link.href = URL.createObjectURL(blob);
//       link.click();
//     }
//   }
// });
