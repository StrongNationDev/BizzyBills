// scripts/airtimeto_cash.js
import { getCurrentUser } from './user.js';

emailjs.init("MrW-NEmG--UIlGYKS"); // Your EmailJS public key

let currentUser = null;

// Fetch current user on load
(async () => {
  currentUser = await getCurrentUser();
  console.log("Current User:", currentUser);
})();

// DOM elements
const networkSelect = document.getElementById("networkSelect");
const networkLogo = document.getElementById("networkLogo");
const networkLabel = document.getElementById("networkLabel");
const receiveMethod = document.getElementById("receiveMethod");
const receiveLabel = document.getElementById("receiveLabel");
const phoneInput = document.getElementById("phoneInput");
const amountInput = document.getElementById("amountInput");
const accountInput = document.getElementById("account");
const userBankUsername = document.getElementById("UserBankUsername");
const proceedBtn = document.getElementById("proceedBtn");

// States
let selectedNetwork = "MTN";
let selectedBank = null;

// Create a dropdown dynamically
function showDropdown(triggerEl, options, callback) {
  closeDropdown();

  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown-menu");
  Object.assign(dropdown.style, {
    position: "absolute",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
    width: "100%",
    top: `${triggerEl.offsetTop + triggerEl.offsetHeight + 4}px`,
    left: `${triggerEl.offsetLeft}px`,
    zIndex: "1000",
  });

  options.forEach((opt) => {
    const item = document.createElement("div");
    item.textContent = opt;
    Object.assign(item.style, {
      padding: "10px 12px",
      cursor: "pointer",
      fontSize: "15px",
    });
    item.addEventListener("mouseenter", () => (item.style.background = "var(--input-bg)"));
    item.addEventListener("mouseleave", () => (item.style.background = "transparent"));
    item.addEventListener("click", () => {
      callback(opt);
      closeDropdown();
    });
    dropdown.appendChild(item);
  });

  document.body.appendChild(dropdown);
}

function closeDropdown() {
  document.querySelectorAll(".dropdown-menu").forEach((el) => el.remove());
}

document.addEventListener("click", closeDropdown);

// Handle network select
networkSelect.addEventListener("click", (e) => {
  e.stopPropagation();
  const networks = ["MTN", "GLO", "AIRTEL"];
  showDropdown(networkSelect, networks, (choice) => {
    selectedNetwork = choice;
    networkLogo.textContent = choice;
    networkLabel.textContent = choice;
    validateForm();
  });
});

// Handle receive method
receiveMethod.addEventListener("click", (e) => {
  e.stopPropagation();
  const banks = [
    "Kuda Microfinance Bank",
    "Opay Microfinance Bank",
    "Palmpay Microfinance Bank",
    "FirstMonie Microfinance Bank",
    "Moniepoint Microfinance Bank",
  ];
  showDropdown(receiveMethod, banks, (choice) => {
    selectedBank = choice;
    receiveLabel.textContent = choice;
    userBankUsername.textContent = currentUser?.username || "Verified Account";
    validateForm();
  });
});

// Validation
function validateForm() {
  const phone = phoneInput.value.trim();
  const amount = amountInput.value.trim();
  const account = accountInput.value.trim();

  if (selectedNetwork && selectedBank && phone.length === 10 && account.length === 10 && amount !== "") {
    proceedBtn.disabled = false;
  } else {
    proceedBtn.disabled = true;
  }
}

[phoneInput, amountInput, accountInput].forEach((input) => input.addEventListener("input", validateForm));

// Proceed
proceedBtn.addEventListener("click", async () => {
  if (!currentUser) currentUser = await getCurrentUser();

  const data = {
    network: selectedNetwork,
    phone: phoneInput.value.trim(),
    amount: amountInput.value.trim(),
    bank: selectedBank,
    account: accountInput.value.trim(),
  };

  const userInfo = currentUser
    ? `
User Info:
- Username: ${currentUser.username || "N/A"}
- Email: ${currentUser.email || "N/A"}
- Phone: ${currentUser.phone_number || "N/A"}
- Wallet Balance: ${currentUser.wallet_balance ?? "N/A"}`
    : "User not logged in.";

  const message = `
Airtime to Cash Request:

Network: ${data.network}
Phone with Airtime: ${data.phone}
Amount: ₦${data.amount}
Bank: ${data.bank}
Account Number: ${data.account}

${userInfo}
`;

  const templateParams = {
    from_name: currentUser?.username || "Airtime2Cash User",
    from_email: currentUser?.email || "no-reply@bizzybills.ng",
    message,
    to_email: "bizzybillsng@gmail.com",
  };

  proceedBtn.disabled = true;
  emailjs
    .send("service_qgcygqo", "template_xr7md0a", templateParams)
    .then(() => {
      alert("✅ Request sent successfully!");
      setTimeout(() => {
        window.location.href = "transfer-airtime.html";
      }, 2000);
    })

    // .then(() => {
    //   alert("✅ Request sent successfully!");
    //   phoneInput.value = "";
    //   amountInput.value = "";
    //   accountInput.value = "";
    //   receiveLabel.textContent = "Receive Cash Method";
    //   userBankUsername.textContent = "-";
    //   selectedBank = null;
    //   validateForm();
    // })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      alert("❌ Failed to send. Please try again.");
      proceedBtn.disabled = false;
    });
});
