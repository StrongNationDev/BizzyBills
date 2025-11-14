import { getCurrentUser, supabase } from "./user.js";

let selectedNetwork = null;

/* ---------------------------------------------------
   NETWORK SELECTION
--------------------------------------------------- */
document.querySelectorAll(".network-icon").forEach(icon => {
  icon.addEventListener("click", () => {
    selectedNetwork = icon.getAttribute("network");
    console.log("📡 Network Selected:", selectedNetwork);

    document.querySelectorAll(".network-icon")
      .forEach(i => i.classList.remove("active-network"));

    icon.classList.add("active-network");
  });
});

/* ---------------------------------------------------
   OPEN CONFIRMATION MODAL
--------------------------------------------------- */
document.getElementById("openConfirm").addEventListener("click", () => {
  const phone = document.getElementById("DestinationNumber").value.trim();
  const amount = document.getElementById("AmountToCharge").value.trim();

  if (!phone || !amount || !selectedNetwork) {
    alert("Please fill all fields and select a network.");
    return;
  }

  document.getElementById("mPhone").innerText = phone;
  document.getElementById("mAmount").innerText = amount;
  document.getElementById("confirmModal").style.display = "flex";
});

/* ---------------------------------------------------
   CLOSE CONFIRMATION MODAL
--------------------------------------------------- */
document.getElementById("cancelOrder").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
});

/* ---------------------------------------------------
   PIN ENTRY SYSTEM
--------------------------------------------------- */
let pin = "";

// show PIN modal
document.getElementById("confirmOrder").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
  document.getElementById("pinModal").style.display = "flex";
});

// update dots
function updateDots() {
  ["d1", "d2", "d3", "d4"].forEach((id, index) => {
    const dot = document.getElementById(id);
    dot.classList.toggle("filled", index < pin.length);
  });
}

// close PIN modal
document.getElementById("closePin").addEventListener("click", () => {
  document.getElementById("pinModal").style.display = "none";
  pin = "";
  updateDots();
});

/* ---------------------------------------------------
   HANDLE KEYPAD
--------------------------------------------------- */
document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", async () => {
    const val = btn.textContent;

    if (val === "Clear") {
      pin = "";
      updateDots();
      return;
    }

    if (!isNaN(val)) {
      if (pin.length < 4) {
        pin += val;
        updateDots();
      }
    }

    if (btn.classList.contains("confirm-pin-btn")) {
      if (pin.length !== 4) {
        alert("PIN must be 4 digits.");
        return;
      }

      console.log("Entered PIN:", pin);

      // NOW → verify PIN + process transaction
      await handleTransactionWithPIN();

      pin = "";
      updateDots();
    }
  });
});

/* ---------------------------------------------------
   MAIN TRANSACTION LOGIC (RUNS ONLY AFTER PIN)
--------------------------------------------------- */
async function handleTransactionWithPIN() {
  const user = await getCurrentUser();
  if (!user) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
    return;
  }

  const phone = document.getElementById("DestinationNumber").value.trim();
  const amount = Number(document.getElementById("AmountToCharge").value.trim());

  const payload = {
    network: selectedNetwork,
    phone,
    amount,
    airtime_type: "VTU"
  };

  console.log("📦 Prepared Payload:", payload);

  /* ---------------------------------------------------
     STEP 1 — VERIFY PIN
  --------------------------------------------------- */
  if (user.pin !== pin) {
    alert("❌ Incorrect PIN. Try again.");
    return;
  }

  /* ---------------------------------------------------
     STEP 2 — CHECK BALANCE & DEBIT FIRST
  --------------------------------------------------- */
  if (user.wallet_balance < amount) {
    alert("❌ Insufficient Balance.");
    return;
  }

  const debitRes = await fetch("http://localhost:5000/api/debit-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      amount
    })
  });

  const debitJson = await debitRes.json();

  if (!debitJson.success) {
    alert("❌ Wallet debit failed.");
    return;
  }

  /* ---------------------------------------------------
     STEP 3 — SEND AIRTIME REQUEST
  --------------------------------------------------- */
  document.getElementById("pinModal").style.display = "none";

  let serverResponse;
  try {
    const res = await fetch("http://localhost:5000/api/airtime", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    serverResponse = await res.json();
    console.log("📥 Airtime API Response:", serverResponse);

  } catch (err) {
    console.error("❌ Network error:", err);
    alert("Network error. Try again later.");

    // auto-refund on failure
    await fetch("http://localhost:5000/api/refund-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount })
    });

    return;
  }

  const isSuccess =
    serverResponse.Status?.toLowerCase() === "successful" ||
    serverResponse.status === true ||
    serverResponse.message?.toLowerCase().includes("success");

  /* ---------------------------------------------------
     STEP 4 — FAILED → REFUND
  --------------------------------------------------- */
  if (!isSuccess) {
    console.log("❌ Airtime Failed → refunding user");

    await fetch("http://localhost:5000/api/refund-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount })
    });

    showResult("❌ Failed", serverResponse.message || "Unknown error.");
    return;
  }

  /* ---------------------------------------------------
     STEP 5 — SUCCESS → SAVE HISTORY
  --------------------------------------------------- */
  const newHistoryEntry = {
    id: crypto.randomUUID(),
    type: "airtime",
    network: selectedNetwork,
    phone,
    amount,
    status: "successful",
    time: new Date().toISOString()
  };

  await supabase
    .from("users")
    .update({
      wallet_balance: user.wallet_balance - amount,
      history: [newHistoryEntry, ...(user.history || [])]
    })
    .eq("id", user.id);

  showResult("✅ Success", "Your airtime has been delivered.");
}

/* ---------------------------------------------------
   RESULT MODAL
--------------------------------------------------- */
function showResult(title, msg) {
  document.getElementById("resultTitle").innerText = title;
  document.getElementById("resultMessage").innerText = msg;
  document.getElementById("resultModal").style.display = "flex";
}

document.getElementById("closeResult").addEventListener("click", () => {
  document.getElementById("resultModal").style.display = "none";
});

/* ---------------------------------------------------
   QUICK AMOUNT BUTTONS
--------------------------------------------------- */
const amountInput = document.getElementById("AmountToCharge");
document.querySelectorAll(".amount-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent.replace(/[₦,]/g, "");
    amountInput.value = val;
  });
});
