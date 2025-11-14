import { getCurrentUser, supabase } from "./user.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".form");
  const phoneInput = document.getElementById("DestinationNumber");
  const offerSelect = document.getElementById("offerSelect");
  const networkRadios = document.querySelectorAll('input[name="network"]');

  const DATA_PLANS = {
    1: [ // MTN
      { id: 255, name: "MTN 1GB (SME) - ₦610" },
      { id: 256, name: "MTN 2GB (SME) - ₦1100" },
      { id: 259, name: "MTN 10GB (SME) - ₦6200" },
      { id: 372, name: "MTN 1.4GB (Gifting) - ₦595" },
      { id: 321, name: "MTN 500MB (SME 30 DAYS) - ₦308" },
    ],
    2: [ // Airtel
      { id: 305, name: "Airtel 1GB (SME) - ₦1092.5" },
      { id: 395, name: "Airtel 2GB (Gifting) - ₦1520" },
    ],
    3: [ // Glo
      { id: 249, name: "Glo 1GB (SME) - ₦400" },
      { id: 250, name: "Glo 2GB (SME) - ₦800" },
    ],
    4: [ // 9Mobile
      { id: 278, name: "9Mobile 1GB (Corporate) - ₦160" },
      { id: 279, name: "9Mobile 2GB (Corporate) - ₦320" },
    ],
  };

  let selectedNetworkId = null;
  let selectedNetworkName = null;
  let currentUser = await getCurrentUser();

  if (!currentUser) {
    alert("Please login to continue.");
    window.location.href = "login.html";
    return;
  }

  // ------------------ POPULATE PLANS ------------------
  function populatePlans(networkId) {
    offerSelect.innerHTML = '<option value="">Select Data Plan</option>';
    const plans = DATA_PLANS[networkId];
    if (!plans) return;
    plans.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      offerSelect.appendChild(opt);
    });
  }

  // ------------------ NETWORK SELECTION ------------------
  networkRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      selectedNetworkId = parseInt(radio.id);
      selectedNetworkName = selectedNetworkId === 1 ? "MTN" :
                            selectedNetworkId === 2 ? "AIRTEL" :
                            selectedNetworkId === 3 ? "GLO" : "9MOBILE";
      populatePlans(selectedNetworkId);
    });
  });

  // ------------------ MODALS ------------------
  const confirmModal = document.createElement("div");
  confirmModal.id = "confirmModal";
  confirmModal.className = "modal";
  confirmModal.innerHTML = `
    <div class="modal-content">
      <h4>You are about to buy Data</h4>
      <p>Order Details</p>
      <p>Phone: <span id="mPhone"></span></p>
      <p>Network: <span id="mNetwork"></span></p>
      <p>Plan: <span id="mPlan"></span></p>
      <p>Cashback: ₦0</p>
      <button id="confirmOrder" class="modal-btn confirm">Confirm PIN</button>
      <button id="cancelOrder" class="modal-btn cancel">Cancel</button>
    </div>`;
  document.body.appendChild(confirmModal);

  const pinModal = document.createElement("div");
  pinModal.id = "pinModal";
  pinModal.className = "modal";
  pinModal.innerHTML = `
    <div class="modal-content pin-box">
      <h4>Enter Transaction PIN</h4>
      <div class="pin-display">
        <span class="pin-dot" id="d1"></span>
        <span class="pin-dot" id="d2"></span>
        <span class="pin-dot" id="d3"></span>
        <span class="pin-dot" id="d4"></span>
      </div>
      <div class="keypad">
        <button class="key">1</button><button class="key">2</button><button class="key">3</button>
        <button class="key">4</button><button class="key">5</button><button class="key">6</button>
        <button class="key">7</button><button class="key">8</button><button class="key">9</button>
        <button class="key clear">Clear</button><button class="key">0</button>
        <button class="key confirm-pin-btn">Confirm Order</button>
      </div>
      <button id="closePin" class="modal-btn cancel">Cancel</button>
    </div>`;
  document.body.appendChild(pinModal);

  const resultModal = document.createElement("div");
  resultModal.id = "resultModal";
  resultModal.className = "modal";
  resultModal.innerHTML = `
    <div class="modal-content">
      <h4 id="resultTitle"></h4>
      <p id="resultMessage"></p>
      <button id="closeResult" class="modal-btn confirm">Close</button>
    </div>`;
  document.body.appendChild(resultModal);

  const showModal = (modal) => modal.style.display = "flex";
  const hideModal = (modal) => modal.style.display = "none";

  // ------------------ FORM SUBMIT ------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    const planId = offerSelect.value;
    const planText = offerSelect.selectedOptions[0]?.text;

    if (!phone || !selectedNetworkId || !planId) {
      return alert("Please fill all fields before proceeding!");
    }

    document.getElementById("mPhone").textContent = phone;
    document.getElementById("mNetwork").textContent = selectedNetworkName;
    document.getElementById("mPlan").textContent = planText;

    const amount = parseFloat(planText.match(/₦([\d,.]+)/)?.[1].replace(/,/g,"")) || 0;

    // Check wallet balance before showing PIN modal
    if (currentUser.wallet_balance < amount) {
      alert("Your Balance is not enough for this order to complete");
      return;
    }

    showModal(confirmModal);

    document.getElementById("confirmOrder").onclick = () => {
      hideModal(confirmModal);
      showModal(pinModal);
    };

    document.getElementById("cancelOrder").onclick = () => hideModal(confirmModal);
    document.getElementById("closePin").onclick = () => hideModal(pinModal);

    // ------------------ PIN LOGIC ------------------
    let pinValue = "";
    const updatePinDisplay = () => {
      for (let i = 1; i <= 4; i++) {
        document.getElementById("d" + i).textContent = pinValue[i - 1] ? "•" : "";
      }
    };

    pinModal.querySelectorAll(".key").forEach(key => {
      key.addEventListener("click", async () => {
        if (key.classList.contains("clear")) {
          pinValue = "";
        } else if (key.classList.contains("confirm-pin-btn")) {
          if (pinValue.length !== 4) return alert("Enter 4-digit PIN");
          if (pinValue !== currentUser.pin) return alert("Incorrect PIN");

          hideModal(pinModal);

          // Proceed transaction
          try {
            const res = await fetch("http://localhost:5000/api/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                network: selectedNetworkName,
                network_id: selectedNetworkId,
                phone,
                data_plan: planId,
                pin: pinValue,
                userId: currentUser.id
              })
            });
            const result = await res.json();

            document.getElementById("resultTitle").textContent =
              result.status === "success" ? "✅ Success" : "❌ Failed";
            document.getElementById("resultMessage").textContent =
              result.message || "Transaction completed.";

            // Update wallet balance in front-end
            if (result.status === "success") {
              currentUser.wallet_balance -= amount;
            }

            showModal(resultModal);
          } catch (err) {
            document.getElementById("resultTitle").textContent = "⚠️ Error";
            document.getElementById("resultMessage").textContent = "Something went wrong. Please try again.";
            showModal(resultModal);
          }

          pinValue = "";
          updatePinDisplay();

        } else {
          if (pinValue.length < 4) pinValue += key.textContent;
        }
        updatePinDisplay();
      });
    });
  });

  document.getElementById("closeResult").onclick = () => hideModal(resultModal);

  // ------------------ NETWORK ICON ACTIVE STATE ------------------
  const radios = document.querySelectorAll('.networks input[type="radio"][name="network"]');
  const updateActive = () => {
    radios.forEach(r => {
      const img = r.closest('label')?.querySelector('img.network-icon');
      if (!img) return;
      img.classList.toggle('active-network', r.checked);
    });
  };
  radios.forEach(r => r.addEventListener('change', updateActive));
  updateActive();
});
