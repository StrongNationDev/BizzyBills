import { getCurrentUser } from "./user.js";

/* =========================
   API CONFIG
========================= */
const API_KEY = "T9QhhQcygRxyE4qqOjcuNH7STj0mLmnELw13y9fc";
const API_BASE = "https://mypay.ng/api/bill";

/* =========================
   PROVIDERS
========================= */
const providers = [
  { id: 1, name: "Ikeja Electric" },
  { id: 2, name: "Eko Electric" },
  { id: 3, name: "Kano Electric" },
  { id: 4, name: "Port Harcourt Electric" },
  { id: 5, name: "Jos Electric" },
  { id: 6, name: "Ibadan Electric" },
  { id: 7, name: "Kaduna Electric" },
  { id: 8, name: "Abuja Electric" },
  { id: 9, name: "Enugu Electric" },
  { id: 10, name: "Benin Electric" },
  { id: 11, name: "Yola Electric" }
];

/* =========================
   DOM ELEMENTS
========================= */
const providerDropdown = document.getElementById("provider-dropdown");
const providerModal = document.getElementById("provider-list-modal");
const providerItems = document.getElementById("provider-items");
const closeProviderList = document.getElementById("close-provider-list");
const providerSearch = document.getElementById("provider-search");

const validateBtn = document.getElementById("continuetopay");

const confirmModal = document.getElementById("confirmModal");
const pinModal = document.getElementById("pinModal");
const resultModal = document.getElementById("resultModal");
const insufficientModal = document.getElementById("insufficientModal");

const confirmOrderBtn = document.getElementById("confirmOrder");
const cancelOrderBtn = document.getElementById("cancelOrder");

const closePinBtn = document.getElementById("closePin");
const closeResultBtn = document.getElementById("closeResult");

/* =========================
   GLOBAL DATA
========================= */
let selectedProvider = null;
let validatedCustomer = null;
let pin = "";

/* =========================
   LOAD PROVIDERS
========================= */
function loadProviders() {
  providerItems.innerHTML = "";
  providers.forEach(provider => {
    const li = document.createElement("li");
    li.textContent = provider.name;
    li.onclick = () => selectProvider(provider);
    providerItems.appendChild(li);
  });
}

function selectProvider(provider) {
  selectedProvider = provider;
  providerDropdown.innerHTML = `<option selected>${provider.name}</option>`;
  providerModal.style.display = "none";
}

providerDropdown.addEventListener("click", () => {
  providerModal.style.display = "block";
  loadProviders();
});

closeProviderList.addEventListener("click", () => {
  providerModal.style.display = "none";
});

providerSearch.addEventListener("input", () => {
  const value = providerSearch.value.toLowerCase();
  [...providerItems.children].forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
});

/* =========================
   VALIDATE METER
========================= */
validateBtn.addEventListener("click", async () => {
  const meterNumber = document.getElementById("meterNumber").value.trim();
  const meterType = document.getElementById("metertype").value;
  const amount = document.getElementById("AmountToPay").value.trim();
  const phone = document.getElementById("customerNumber").value.trim();

  if (!selectedProvider || !meterNumber || !meterType || !amount) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/bill-validation?meter_number=${meterNumber}&meter_type=${meterType}&disco=${selectedProvider.id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const data = await res.json();

    if (data.status !== "success") {
      alert("Meter validation failed");
      return;
    }

    validatedCustomer = data;

    // Fill confirmation modal
    document.querySelectorAll("#meterNumber")[1].textContent =
      selectedProvider.name;

    document.querySelectorAll("#meterNumber")[2].textContent = meterNumber;
    document.querySelectorAll("#meterNumber")[3].textContent = meterType;

    document.getElementById("cPhone").textContent = phone || "N/A";
    document.getElementById("mAmount").textContent = amount;

    confirmModal.style.display = "flex";
  } catch (err) {
    console.error(err);
    alert("Validation error");
  }
});

/* =========================
   CONFIRMATION MODAL
========================= */
confirmOrderBtn.addEventListener("click", () => {
  confirmModal.style.display = "none";
  pinModal.style.display = "flex";
});

cancelOrderBtn.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

/* =========================
   PIN PAD
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
  const meterNumber = document.getElementById("meterNumber").value.trim();
  const meterType = document.getElementById("metertype").value;
  const amount = document.getElementById("AmountToPay").value.trim();
  const phone = document.getElementById("customerNumber").value.trim();

  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        disco: selectedProvider.id,
        meter_type: meterType,
        meter_number: meterNumber,
        amount,
        phone,
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
   INIT
========================= */
loadProviders();





/* =========================
   FORCE DEMO VALIDATION (ELECTRICITY)
========================= */
function forceElectricityValidation() {
  // Fake confirmation data
  document.querySelectorAll("#meterNumber")[1].textContent = "Ikeja Electric";
  document.querySelectorAll("#meterNumber")[2].textContent = "12345678901";
  document.querySelectorAll("#meterNumber")[3].textContent = "prepaid";

  document.getElementById("cPhone").textContent = "08012345678";
  document.getElementById("mAmount").textContent = "5000";

  // Open confirmation modal
  confirmModal.style.display = "flex";

  // Auto-open PIN modal after 1 second (optional)
  setTimeout(() => {
    confirmModal.style.display = "none";
    pinModal.style.display = "flex";
  }, 1000);
}