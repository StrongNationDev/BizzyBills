// ✅ File: scripts/data.js
import { getCurrentUser } from './user.js';

const networkRadios = document.querySelectorAll('#network_ids input');
const planSelect = document.querySelector('#plans select');
const destinationInput = document.getElementById('DestinationNumber');
const payButton = document.querySelector('.pay-button');

// Store selected values
let selectedNetworkId = null;
let selectedNetworkName = null;
let selectedNetworkIcon = null;
let selectedPlanId = null;
let selectedPlanAmount = null;
let selectedPlanLabel = null;

(async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  // Network Selection with style
  networkRadios.forEach((radio, index) => {
    const label = radio.closest('label');
    const img = label.querySelector('img');

    radio.addEventListener('change', () => {
      networkRadios.forEach(r => r.closest('label').style.backgroundColor = '');
      label.style.backgroundColor = 'black';

      selectedNetworkName = img.alt;
      selectedNetworkIcon = img.src;
      selectedNetworkId = img.alt === 'MTN' ? 1 : img.alt === 'Glo' ? 2 : 4; // Airtel = 4

      populatePlans(selectedNetworkId);
    });
  });

  // Dynamically populate plans by network
  function populatePlans(networkId) {
    const plans = {
      1: [ // MTN
        { id: 230, label: '3.5GB - ₦2407 (30 days)' },
        { id: 50, label: '2.0GB - ₦1448 (30 days)' },
        { id: 51, label: '1.5GB - ₦964 (7 days)' },
        { id: 394, label: '500MB - ₦485 (7 days)' },
      ],
      2: [ // GLO
        { id: 27, label: '12.5GB - ₦3720 (30 days)' },
        { id: 28, label: '10GB - ₦2790 (30 days)' },
        { id: 29, label: '7.5GB - ₦2325 (30 days)' },
      ],
      4: [ // AIRTEL
        { id: 453, label: '3GB - ₦1000 (2 days)' },
        { id: 454, label: '75MB - ₦75 (1 day)' },
        { id: 455, label: '10GB - ₦3000 (7 days)' },
      ]
    };

    planSelect.innerHTML = '';
    plans[networkId].forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = plan.label;
      planSelect.appendChild(option);
    });
  }

  // On Pay
  payButton.addEventListener('click', e => {
    e.preventDefault();

    const phone = destinationInput.value.trim();
    if (!phone || !selectedNetworkId) return alert('Fill all fields.');

    selectedPlanId = planSelect.value;
    selectedPlanLabel = planSelect.options[planSelect.selectedIndex].text;
    const match = selectedPlanLabel.match(/\u20a6(\d+[.,]?\d*)/);
    selectedPlanAmount = match ? parseFloat(match[1].replace(',', '')) : 0;

    const payload = {
      type: 'data',
      phone,
      amount: selectedPlanAmount,
      network: selectedNetworkName,
      network_id: selectedNetworkId,
      network_icon: selectedNetworkIcon,
      plan_id: parseInt(selectedPlanId),
      plan_label: selectedPlanLabel
    };

    localStorage.setItem('pendingTransaction', JSON.stringify(payload));
    window.location.href = 'confirm.html?type=data';
  });
})();
