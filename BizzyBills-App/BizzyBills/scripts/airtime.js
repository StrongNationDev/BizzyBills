import { getCurrentUser, supabase } from './user.js';

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

const amountInput = document.getElementById('AmountToCharge');
const amountButtons = document.querySelectorAll('.amount-btn');

amountButtons.forEach(button => {
  button.addEventListener('click', () => {
    const amount = button.textContent.replace(/[₦,]/g, '');
    amountInput.value = amount;
  });
});

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

  const { data: profile, error } = await supabase
  .from('users') // ← changed from 'profiles' to 'users'
  .select('wallet_balance, username')
  .eq('id', user.id)
  .single();

  if (error || !profile) {
    alert("Error fetching wallet details.");
    return;
  }

  const walletBalance = parseFloat(profile.wallet_balance);
  const username = profile.username;

  if (amount > walletBalance) {
    // 🔔 Show a modal or fallback to alert
    showModal(`Oh @${username}, your wallet balance (₦${walletBalance}) is not up to the value of the airtime (₦${amount}) you want to buy. Please fund your BizzyBills NG Wallet and try again.`);
    return;
  }

  // ✅ All checks passed: proceed with transaction
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

function showModal(message) {
  let modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';

  modal.innerHTML = `
    <div style="background: white; padding: 30px; max-width: 400px; border-radius: 8px; text-align: center;">
      <p style="margin-bottom: 20px;">${message}</p>
      <button id="closeModalBtn" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    modal.remove();
  });
}
