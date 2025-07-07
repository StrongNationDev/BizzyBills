// scripts/airtime.js
import { getCurrentUser, supabase } from './user.js';

// =======================
// 1. Make Network Selectable
// =======================
const networkIcons = document.querySelectorAll('.network-icon');
let selectedNetworkId = null;
let selectedNetworkName = '';
let selectedNetworkIcon = '';

networkIcons.forEach((icon, index) => {
  icon.addEventListener('click', () => {
    networkIcons.forEach(i => i.classList.remove('selected-network'));
    icon.classList.add('selected-network');

    selectedNetworkId = parseInt(icon.getAttribute('network'));
    selectedNetworkName = icon.alt;
    selectedNetworkIcon = icon.src;
  });
});

// =======================
// 2. Auto-fill Amount
// =======================
const amountInput = document.getElementById('AmountToCharge');
const amountButtons = document.querySelectorAll('.amount-btn');

amountButtons.forEach(button => {
  button.addEventListener('click', () => {
    const amount = button.textContent.replace(/[₦,]/g, '');
    amountInput.value = amount;
  });
});

// =======================
// 3. Submit Handler
// =======================
document.querySelector('.recharge-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = await getCurrentUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  const phone = document.getElementById('DestinationNumber').value.trim();
  const amount = parseFloat(document.getElementById('AmountToCharge').value.trim());

  if (!phone || !amount || !selectedNetworkId) {
    alert("Please fill all fields and select a network.");
    return;
  }

  // Store in localStorage for now (cloud write will happen after transaction)
  const payload = {
    phone,
    amount,
    network_id: selectedNetworkId,
    network: selectedNetworkName,
    network_icon: selectedNetworkIcon,
    product: "Airtime Recharge"
  };

  localStorage.setItem('pendingTransaction', JSON.stringify(payload));

  window.location.href = "confirm.html";
});
