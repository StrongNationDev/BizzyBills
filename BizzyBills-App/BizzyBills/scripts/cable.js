/* =========================
   API CONFIG
========================= */
const API_KEY = "T9QhhQcygRxyE4qqOjcuNH7STj0mLmnELw13y9fc";
const API_BASE = "https://mypay.ng/api/cable";

/* =========================
   PROVIDERS
========================= */
const cableProviders = [
  { id: 2, name: "GOTV" },
  { id: 3, name: "STARTIMES" },
  { id: 4, name: "SHOWMAX" },
  { id: 5, name: "DSTV" }
];

/* =========================
   CABLE PLANS
========================= */
const cablePlans = [
  // GOTV
  { id: 1, provider: 2, name: "GOtv Max", amount: 7200 },
  { id: 2, provider: 2, name: "GOtv Jinja Bouquet", amount: 3300 },
  { id: 3, provider: 2, name: "GOtv Jolli Bouquet", amount: 4850 },
  { id: 4, provider: 2, name: "GOtv Supa", amount: 9600 },
  { id: 5, provider: 2, name: "GOtv Supa Plus", amount: 15700 },
  { id: 6, provider: 2, name: "GOtv Smallie", amount: 1575 },

  // STARTIMES
  { id: 19, provider: 3, name: "Startime Super (Antenna) - Monthly", amount: 8000 },
  { id: 20, provider: 3, name: "Startime Super (Antenna) - Weekly", amount: 2700 },
  { id: 21, provider: 3, name: "Startime Smart (Dish) - Monthly", amount: 2800 },
  { id: 22, provider: 3, name: "Startime Classic (Dish) - Weekly", amount: 2100 },
  { id: 23, provider: 3, name: "Startime Classic (Dish) - Monthly", amount: 6200 },
  { id: 24, provider: 3, name: "Startime Sport Plus (Dish) - Monthly", amount: 1200 },
  { id: 25, provider: 3, name: "Startime Smart (Dish) - Weekly", amount: 900 },
  { id: 26, provider: 3, name: "Startime Basic (Antenna) - Weekly", amount: 1100 },
  { id: 27, provider: 3, name: "Startime Basic (Antenna) - Monthly", amount: 3300 },
  { id: 28, provider: 3, name: "Startime Classic (Antenna) - Weekly", amount: 1700 },
  { id: 29, provider: 3, name: "Startime Classic (Antenna) - Monthly", amount: 5000 },
  { id: 30, provider: 3, name: "Startime Chinese (Dish)", amount: 16000 },
  { id: 31, provider: 3, name: "Startime Super (Dish) - Monthly", amount: 8200 },
  { id: 32, provider: 3, name: "Startime Super (Dish) - Weekly", amount: 2800 },
  { id: 33, provider: 3, name: "Startime Basic (Dish) - Monthly", amount: 4200 },
  { id: 34, provider: 3, name: "Startime Basic (Dish) - Weekly", amount: 1400 },
  { id: 35, provider: 3, name: "Startime Nova (Antenna) - Weekly", amount: 500 },
  { id: 36, provider: 3, name: "Startime Nova (Antenna) - Monthly", amount: 1700 },
  { id: 37, provider: 3, name: "Startime Nova (Dish) - Monthly", amount: 1700 },
  { id: 38, provider: 3, name: "Startime Nova (Dish) - Weekly", amount: 600 },

  // SHOWMAX
  { id: 39, provider: 4, name: "Showmax for Mobile", amount: 1200 },
  { id: 40, provider: 4, name: "Showmax", amount: 2900 },
  { id: 41, provider: 4, name: "Showmax Pro for Mobile", amount: 3200 },
  { id: 42, provider: 4, name: "Showmax Pro", amount: 6300 },

  // DSTV
  { id: 44, provider: 5, name: "DStv Compact", amount: 15700 },
  { id: 46, provider: 5, name: "DStv Compact Plus", amount: 25000 },
  { id: 47, provider: 5, name: "DStv Premium", amount: 37000 },
  { id: 48, provider: 5, name: "DStv Yanga Bouquet", amount: 5100 },
  { id: 49, provider: 5, name: "DStv Comfan Bouquet", amount: 9300 }
];

/* =========================
   DOM ELEMENTS
========================= */
const providerSelect = document.getElementById("provider-select");
const planSelect = document.getElementById("plan-select");

const providerModal = document.getElementById("provider-list-modal");
const planModal = document.getElementById("plan-list-modal");

const providerItems = document.getElementById("provider-items");
const planItems = document.getElementById("plan-items");

const providerSearch = document.getElementById("provider-search");
const planSearch = document.getElementById("plan-search");

const closeProviderBtn = document.getElementById("close-provider-list");
const closePlanBtn = document.getElementById("close-plan-list");

const verifyBtn = document.getElementById("verify-details-btn");

const confirmModal = document.getElementById("confirmModal");
const pinModal = document.getElementById("pinModal");
const resultModal = document.getElementById("resultModal");

const confirmOrderBtn = document.getElementById("confirmOrder");
const cancelOrderBtn = document.getElementById("cancelOrder");

const closePinBtn = document.getElementById("closePin");
const closeResultBtn = document.getElementById("closeResult");

/* =========================
   GLOBAL STATE
========================= */
let selectedProvider = null;
let selectedPlan = null;
let pin = "";

/* =========================
   OPEN PROVIDER MODAL
========================= */
providerSelect.addEventListener("click", () => {
  providerModal.style.display = "flex";
  renderProviders();
});

closeProviderBtn.onclick = () => {
  providerModal.style.display = "none";
};

/* =========================
   RENDER PROVIDERS
========================= */
function renderProviders() {
  providerItems.innerHTML = "";
  cableProviders.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name;
    li.onclick = () => selectProvider(p);
    providerItems.appendChild(li);
  });
}

function selectProvider(provider) {
  selectedProvider = provider;
  providerSelect.innerHTML = `<option selected>${provider.name}</option>`;
  providerModal.style.display = "none";

  selectedPlan = null;
  planSelect.innerHTML = `<option selected disabled>Choose a Cable Plan</option>`;
}

/* =========================
   PROVIDER SEARCH
========================= */
providerSearch.addEventListener("input", () => {
  const term = providerSearch.value.toLowerCase();
  [...providerItems.children].forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(term)
      ? "block"
      : "none";
  });
});

/* =========================
   OPEN PLAN MODAL
========================= */
planSelect.addEventListener("click", () => {
  if (!selectedProvider) {
    alert("Please select a provider first");
    return;
  }

  planModal.style.display = "flex";
  renderPlans();
});

closePlanBtn.onclick = () => {
  planModal.style.display = "none";
};

/* =========================
   RENDER PLANS
========================= */
function renderPlans() {
  planItems.innerHTML = "";

  const filteredPlans = cablePlans.filter(
    p => p.provider === selectedProvider.id
  );

  filteredPlans.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - ₦${p.amount.toLocaleString()}`;
    li.onclick = () => selectPlan(p);
    planItems.appendChild(li);
  });
}

function selectPlan(plan) {
  selectedPlan = plan;
  planSelect.innerHTML = `<option selected>${plan.name}</option>`;
  planModal.style.display = "none";
}

/* =========================
   PLAN SEARCH
========================= */
planSearch.addEventListener("input", () => {
  const term = planSearch.value.toLowerCase();
  [...planItems.children].forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(term)
      ? "block"
      : "none";
  });
});

/* =========================
   VERIFY IUC
========================= */
verifyBtn.addEventListener("click", async () => {
  const iuc = document.getElementById("iuc-number-input").value.trim();

  if (!selectedProvider || !selectedPlan || !iuc) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(
      `https://mypay.ng/api/cable/cable-validation?iuc=${iuc}&cable=${selectedProvider.id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const data = await res.json();

    if (data.status !== "success") {
      alert("IUC Verification Failed");
      return;
    }

    document.getElementById("mPhone").textContent = iuc;
    document.getElementById("mAmount").textContent =
      selectedPlan.amount.toLocaleString();

    confirmModal.style.display = "flex";
  } catch (err) {
    console.error(err);
    alert("Verification error");
  }
});

/* =========================
   CONFIRMATION MODAL
========================= */
confirmOrderBtn.onclick = () => {
  confirmModal.style.display = "none";
  pinModal.style.display = "flex";
};

cancelOrderBtn.onclick = () => {
  confirmModal.style.display = "none";
};

/* =========================
   PIN KEYPAD
========================= */
document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", async () => {
    if (btn.classList.contains("clear")) {
      pin = "";
    } else if (btn.classList.contains("confirm-pin-btn")) {
      await processPayment();
      return;
    } else {
      if (pin.length < 4) pin += btn.textContent;
    }

    updatePinDots();
  });
});

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`d${i}`).style.background =
      pin.length >= i ? "#000" : "#ddd";
  }
}

closePinBtn.onclick = () => {
  pin = "";
  updatePinDots();
  pinModal.style.display = "none";
};

/* =========================
   PROCESS PAYMENT
========================= */
async function processPayment() {
  const iuc = document.getElementById("iuc-number-input").value.trim();

  try {
    const res = await fetch("https://mypay.ng/api/cable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cable: selectedProvider.id,
        iuc,
        cable_plan: selectedPlan.id,
        bypass: false
      })
    });

    const data = await res.json();

    pinModal.style.display = "none";
    resultModal.style.display = "flex";

    if (data.status === "success") {
      document.getElementById("resultTitle").textContent = "Success";
      document.getElementById("resultMessage").textContent = data.message;
    } else {
      document.getElementById("resultTitle").textContent = "Failed";
      document.getElementById("resultMessage").textContent = data.message;
    }
  } catch (err) {
    pinModal.style.display = "none";
    resultModal.style.display = "flex";
    document.getElementById("resultTitle").textContent = "Error";
    document.getElementById("resultMessage").textContent =
      "Transaction failed";
  }
}

closeResultBtn.onclick = () => {
  resultModal.style.display = "none";
};





/* =========================
   FORCE DEMO VALIDATION (CABLE)
========================= */
function forceCableValidation() {
  document.getElementById("mPhone").textContent = "01831092587";
  document.getElementById("mAmount").textContent = "4850";

  // Open confirmation modal
  confirmModal.style.display = "flex";

  // Auto-open PIN modal after 1 second (optional)
  setTimeout(() => {
    confirmModal.style.display = "none";
    pinModal.style.display = "flex";
  }, 1000);
}
