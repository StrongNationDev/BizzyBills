import { getCurrentUser, supabase } from "./user.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ----- DOM refs (existing HTML modals/selects) -----
  const form = document.querySelector(".form");
  const phoneInput = document.getElementById("DestinationNumber");
  const offerSelect = document.getElementById("offerSelect");
  const plansSelect = document.querySelector("#plans select"); // plan select inside #plans
  const networkRadios = document.querySelectorAll('input[name="network"]');

  const confirmModal = document.getElementById("confirmModal");
  const pinModal = document.getElementById("pinModal");
  const resultModal = document.getElementById("resultModal");

  const mPhone = document.getElementById("mPhone");
  const mAmount = document.getElementById("mAmount"); // confirm modal expects amount
  const mNetwork = document.getElementById("mNetwork"); // not in HTML earlier but used elsewhere; we will set mNetwork if exists
  const mPlan = document.getElementById("mPlan");

  const confirmOrderBtn = document.getElementById("confirmOrder");
  const cancelOrderBtn = document.getElementById("cancelOrder");
  const closePinBtn = document.getElementById("closePin");
  const closeResultBtn = document.getElementById("closeResult");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");

  // PIN dots
  const pinDots = ["d1","d2","d3","d4"].map(id=>document.getElementById(id));

  function showModal(el){ if(el) el.style.display = "flex"; }
  function hideModal(el){ if(el) el.style.display = "none"; }

  // ----- DATA structure (approved) -----
  const DATA = {
    1: { // MTN
      SME: [
        { id: 255, name: "MTN 1GB - ₦610", amount: 610 },
        { id: 256, name: "MTN 2GB - ₦1100", amount: 1100 },
        { id: 259, name: "MTN 10GB - ₦6200", amount: 6200 },
        { id: 321, name: "MTN 500MB - ₦308", amount: 308 },
      ],
      CORPORATE: [],
      CORPORATE_GIFTING: [
        { id: 372, name: "MTN 1.4GB - ₦595", amount: 595 },
      ],
    },

    2: { // Airtel
      SME: [
        { id: 305, name: "Airtel 1GB - ₦1092.5", amount: 1092.5 }
      ],
      CORPORATE: [],
      CORPORATE_GIFTING: [
        { id: 395, name: "Airtel 2GB - ₦1520", amount: 1520 }
      ],
    },

    3: { // Glo
      SME: [
        { id: 249, name: "Glo 1GB - ₦400", amount: 400 },
        { id: 250, name: "Glo 2GB - ₦800", amount: 800 },
      ],
      CORPORATE: [],
      CORPORATE_GIFTING: []
    },

    4: { // 9mobile
      SME: [],
      CORPORATE: [
        { id: 278, name: "9Mobile 1GB - ₦160", amount: 160 },
        { id: 279, name: "9Mobile 2GB - ₦320", amount: 320 },
      ],
      CORPORATE_GIFTING: []
    }
  };

  // ----- state -----
  let selectedNetworkId = null;
  let selectedNetworkName = null;
  let selectedOffer = null; // "SME" / "CORPORATE" / "CORPORATE_GIFTING"
  let selectedPlan = null; // { id, name, amount }
  let currentUser = await getCurrentUser();

  if (!currentUser) {
    alert("Please login to continue.");
    window.location.href = "login.html";
    return;
  }

  // ----- Helpers -----
  function formatCurrency(n){
    // format without decimals when integer, else show decimals
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function setActiveNetworkUI() {
    // update img active classes
    document.querySelectorAll('.network-icon').forEach(img=>{
      const radio = img.closest('label')?.querySelector('input[type="radio"]');
      if (!radio) return;
      img.classList.toggle('active-network', radio.checked);
    });
  }

  // Populate offer options (SME, CORPORATE, CORPORATE_GIFTING)
  function populateOffers(networkId) {
    offerSelect.innerHTML = `<option value="">Select Offer</option>`;
    const offers = DATA[networkId];
    if (!offers) return;
    // offers is object with keys SME, CORPORATE, CORPORATE_GIFTING
    Object.keys(offers).forEach(key => {
      const opt = document.createElement("option");
      // display friendly text
      const pretty = key === "CORPORATE_GIFTING" ? "Corporate Gifting" : (key === "CORPORATE" ? "Corporate" : "SME");
      opt.value = key;
      opt.textContent = pretty;
      offerSelect.appendChild(opt);
    });
    // reset plans
    plansSelect.innerHTML = `<option value="">Select Plan</option>`;
    selectedOffer = null;
    selectedPlan = null;
  }

  // Populate plans for given networkId + offer key
  function populatePlans(networkId, offerKey) {
    plansSelect.innerHTML = `<option value="">Select Plan</option>`;
    const list = DATA[networkId]?.[offerKey];
    if (!list || list.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No plans available";
      plansSelect.appendChild(opt);
      selectedPlan = null;
      return;
    }
    list.forEach(p => {
      const opt = document.createElement("option");
      opt.value = JSON.stringify(p); // store plan object as string
      opt.textContent = `${p.name}`;
      plansSelect.appendChild(opt);
    });
    selectedPlan = null;
  }

  // ----- set up network radio listeners -----
  networkRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedNetworkId = parseInt(radio.id);
      selectedNetworkName = selectedNetworkId === 1 ? "MTN"
                          : selectedNetworkId === 2 ? "AIRTEL"
                          : selectedNetworkId === 3 ? "GLO"
                          : "9MOBILE";
      populateOffers(selectedNetworkId);
      setActiveNetworkUI();
    });
  });

  // ----- offer select listener -----
  offerSelect.addEventListener('change', () => {
    const val = offerSelect.value;
    if (!val || !selectedNetworkId) {
      plansSelect.innerHTML = `<option value="">Select Plan</option>`;
      selectedOffer = null;
      selectedPlan = null;
      return;
    }
    selectedOffer = val;
    populatePlans(selectedNetworkId, selectedOffer);
  });

  // ----- plans select listener -----
  plansSelect.addEventListener('change', () => {
    const val = plansSelect.value;
    if (!val) {
      selectedPlan = null;
      return;
    }
    try {
      selectedPlan = JSON.parse(val);
    } catch {
      selectedPlan = null;
    }
  });

  // ----- Transaction context used by PIN keypad ----- 
  const txContext = {
    phone: null,
    network: null,
    network_id: null,
    plan: null, // plan object
    amount: 0
  };

  // ----- Setup PIN keypad handlers once ----- 
  let pinValue = "";
  function updatePinDots(){
    pinDots.forEach((dot, idx) => {
      if (!dot) return;
      dot.classList.toggle('filled', idx < pinValue.length);
      dot.textContent = idx < pinValue.length ? "•" : "";
    });
  }

  // register keys once
  pinModal.querySelectorAll(".key").forEach(key => {
    key.addEventListener('click', async (e) => {
      const val = key.textContent.trim();

      if (key.classList.contains('clear')) {
        pinValue = "";
        updatePinDots();
        return;
      }

      if (key.classList.contains('confirm-pin-btn')) {
        // confirm & proceed
        if (pinValue.length !== 4) { alert("Enter 4-digit PIN"); return; }
        // check currentUser still loaded
        if (!currentUser) { alert("Session expired. Please login again."); window.location.href = "login.html"; return; }
        // verify PIN
        if (pinValue !== String(currentUser.pin)) {
          alert("Incorrect PIN");
          pinValue = "";
          updatePinDots();
          return;
        }

        // proceed transaction using txContext
        hideModal(pinModal);
        await executeTransaction(txContext, currentUser);
        pinValue = "";
        updatePinDots();
        return;
      }

      // numeric key
      if (!isNaN(val)) {
        if (pinValue.length < 4) pinValue += val;
        updatePinDots();
      }
    });
  });

  closePinBtn?.addEventListener('click', () => {
    hideModal(pinModal);
    pinValue = "";
    updatePinDots();
  });

  // ----- Execute transaction (debit => data => refund if needed => update history) -----
  async function executeTransaction(context, user) {
    // context: phone, network, network_id, plan (object), amount
    const { phone, network, network_id, plan, amount } = context;

    // Step 1: request server to debit user
    try {
      const debitRes = await fetch("https://bizzybillsng-sambas-api.onrender.com/api/debit-user", {
      // const debitRes = await fetch("http://localhost:5000/api/debit-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amount })
      });
      const debitJson = await debitRes.json();
      if (!debitJson.success) {
        showResult("❌ Failed", debitJson.message || "Wallet debit failed.");
        return;
      }
    } catch (err) {
      console.error("Debit request error:", err);
      showResult("⚠️ Error", "Could not debit wallet. Try again later.");
      return;
    }

    // Step 2: send data purchase to /api/data
    let apiResponse = null;
    try {
      const res = await fetch("https://bizzybillsng-sambas-api.onrender.com/api/data", {
      // const res = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network,
          phone,
          data_plan: plan.id
        })
      });
      apiResponse = await res.json();
    } catch (err) {
      console.error("Data API network error:", err);
      // refund user on network error
      await refundUser(user.id, amount);
      showResult("❌ Failed", "Network error — refund issued.");
      return;
    }

    // Step 3: determine success from API
    const isSuccess =
      apiResponse?.status === "success" ||
      (typeof apiResponse?.Status === "string" && apiResponse.Status.toLowerCase() === "successful") ||
      (typeof apiResponse?.message === "string" && apiResponse.message.toLowerCase().includes("success"));

    if (!isSuccess) {
      // failed response → refund
      await refundUser(user.id, amount);
      showResult("❌ Failed", apiResponse?.message || "Data purchase failed. Refund issued.");
      return;
    }

    // Step 4: success → update user's history client-side (append at top)
    const newHistoryEntry = {
      id: crypto.randomUUID(),
      type: "data",
      network,
      phone,
      plan: plan.name,
      amount,
      status: "successful",
      time: new Date().toISOString()
    };

    try {
      // attempt to update history client-side (server already debited)
      await supabase
        .from("users")
        .update({
          history: [newHistoryEntry, ...(user.history || [])]
        })
        .eq("id", user.id);

      // refresh currentUser to reflect updated wallet balance from debit endpoint
      currentUser = await getCurrentUser();
    } catch (err) {
      console.error("Error updating history:", err);
      // even if this fails, transaction succeeded. Show success.
    }

    showResult("✅ Success", apiResponse?.message || "Your data has been delivered.");
  }

  // ---- refund helper ----
  async function refundUser(userId, amount) {
    try {
      // await fetch("http://localhost:5000/api/refund-user", {
      await fetch("https://bizzybillsng-sambas-api.onrender.com/api/refund-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount })
      });
      // refresh currentUser after refund
      currentUser = await getCurrentUser();
    } catch (err) {
      console.error("Refund error:", err);
    }
  }

  // ----- Confirm modal & form submit flow ----- 
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    if (!phone) { alert("Enter phone number"); return; }
    if (!selectedNetworkId || !selectedNetworkName) { alert("Select a network"); return; }
    if (!selectedOffer) { alert("Select an offer"); return; }
    if (!selectedPlan) { alert("Select a plan"); return; }

    // selectedPlan is object with id,name,amount
    const amount = Number(selectedPlan.amount);
    if (isNaN(amount)) { alert("Invalid plan amount"); return; }

    // check wallet before opening confirm
    if (currentUser.wallet_balance < amount) {
      // show insufficient modal if exists
      const insufficientModal = document.getElementById("insufficientModal");
      if (insufficientModal) {
        document.getElementById("modalMessage").textContent = "Your Balance is not enough for this order to complete";
        insufficientModal.style.display = "flex";
      } else {
        alert("Your Balance is not enough for this order to complete");
      }
      return;
    }

    // fill confirm modal
    mPhone && (mPhone.textContent = phone);
    mAmount && (mAmount.textContent = formatCurrency(amount));
    mNetwork && (mNetwork.textContent = selectedNetworkName);
    mPlan && (mPlan.textContent = selectedPlan.name);

    // set txContext for PIN stage:
    txContext.phone = phone;
    txContext.network = selectedNetworkName;
    txContext.network_id = selectedNetworkId;
    txContext.plan = selectedPlan;
    txContext.amount = amount;

    // show confirm modal
    showModal(confirmModal);
  });

  // Confirm PIN button opens PIN modal (and close confirm)
  confirmOrderBtn?.addEventListener('click', () => {
    // before opening pin modal check wallet again (fresh)
    if (!currentUser) { alert("Session expired"); window.location.href = "login.html"; return; }
    const amt = txContext.amount || 0;
    if (currentUser.wallet_balance < amt) { alert("Your Balance is not enough for this order to complete"); hideModal(confirmModal); return; }
    hideModal(confirmModal);
    // reset pin input state
    pinValue = "";
    updatePinDots();
    showModal(pinModal);
  });

  cancelOrderBtn?.addEventListener('click', () => {
    hideModal(confirmModal);
  });

  // result close
  closeResultBtn?.addEventListener('click', () => {
    hideModal(resultModal);
  });

  function showResult(title, msg) {
    if (resultTitle) resultTitle.innerText = title;
    if (resultMessage) resultMessage.innerText = msg;
    showModal(resultModal);
  }

  // initial UI tweak
  setActiveNetworkUI();

}); // DOMContentLoaded

