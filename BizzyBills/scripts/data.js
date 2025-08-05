import { getCurrentUser } from './user.js';

const networkRadios = document.querySelectorAll('#network_ids input');
const planSelect = document.querySelector('#plans select');
const destinationInput = document.getElementById('DestinationNumber');
const payButton = document.querySelector('.pay-button');
const offerSelect = document.getElementById('offerSelect');


const dataPlans = {
  1: { // MTN
    "MTN SME": [
      { id: 907, label: '150.0 MB - ₦110 (1Day) MTN SME' },
      { id: 716, label: '3.0 GB - ₦2000 (1Month) MTN SME' },
      { id: 903, label: '500.0 MB - ₦395 (1Day) MTN SME' },
      { id: 908, label: '6.0 GB - ₦2650 (7Days) MTN SME' }
    ],
    "MTN GIFTING": [
      { id: 917, label: '1.2 GB - ₦795 (7Days MTN Pulse Users) MTN SME' },
      { id: 860, label: '90.0 GB - ₦25500 (2Month) MTN GIFTING' },
      { id: 861, label: '150.0 GB - ₦39000 (2Month) MTN GIFTING' }
    ]
  },
  2: { // GLO
    "GLO GIFTING": [
      { id: 421, label: '1.5 GB - ₦450 (1-2Days) GLO GIFTING' },
      { id: 521, label: '2.5 GB - ₦600 (2DAYS) GLO GIFTING' },
      { id: 476, label: '10.0 GB - ₦2300 (7DAYS) GLO GIFTING' }
    ],
    "GLO CORPORATE GIFTING": [
      { id: 910, label: '3.0 GB - ₦1000 (3Days) GLO CORPORATE GIFTING' },
      { id: 221, label: '500.0 MB - ₦250 (1 Month) GLO CORPORATE GIFTING' }
    ]
  },
  4: { // AIRTEL
    "AIRTEL GIFTING": [
      { id: 868, label: '200.0 MB - ₦200 (1Day) AIRTEL GIFTING' },
      { id: 767, label: '1.5 GB - ₦1100 (7Days) AIRTEL GIFTING' },
      { id: 920, label: '3.0 GB - ₦1100 (2DAYS) AIRTEL GIFTING' },
      { id: 918, label: '3.0 GB - ₦1200 (7Days Dont owe debt) AIRTEL GIFTING' },
      { id: 919, label: '10.0 GB - ₦4000 (1Month) AIRTEL GIFTING' }
    ]
  }
};

let selectedNetworkId = null;
let selectedNetworkName = null;
let selectedNetworkIcon = null;

let selectedPlanId = null;
let selectedPlanLabel = null;
let selectedPlanAmount = null;

(async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  // Handle network radio button selections
  networkRadios.forEach((radio) => {
  const label = radio.closest('label');
  const img = label.querySelector('img');

  radio.addEventListener('change', () => {
    // Reset background for all labels
    networkRadios.forEach(r => r.closest('label').style.backgroundColor = '');
    label.style.backgroundColor = 'black';

    selectedNetworkName = img.alt;
    selectedNetworkIcon = img.src;

    // Assign correct ID
    switch (selectedNetworkName.toUpperCase()) {
      case 'MTN': selectedNetworkId = 1; break;
      case 'GLO': selectedNetworkId = 2; break;
      case 'AIRTEL': selectedNetworkId = 4; break;
      default: selectedNetworkId = null;
    }

    offerSelect.innerHTML = '<option value="">Select Offer</option>';
    planSelect.innerHTML = '<option>Select Plan</option>';

    populateOffers(selectedNetworkId);
  });
});

// updating
function populateOffers(networkId) {
  offerSelect.innerHTML = '<option value="">Select Offer</option>';

  const offers = Object.keys(dataPlans[networkId] || {});
  offers.forEach(offer => {
    const option = document.createElement('option');
    option.value = offer;
    option.textContent = offer;
    offerSelect.appendChild(option);
  });
}
offerSelect.addEventListener('change', () => {
  const selectedOffer = offerSelect.value;
  if (selectedOffer && selectedNetworkId) {
    populatePlans(selectedNetworkId, selectedOffer);
  }
});



  // Populate plan options
function populatePlans(networkId, offerName) {
  planSelect.innerHTML = '';

  const networkPlans = dataPlans[networkId];
  if (!networkPlans) {
    console.error(`No plans found for network ID ${networkId}`);
    return;
  }

// Add this inside your async function, after populatePlans() is defined
  offerSelect.addEventListener('change', () => {
    const selectedOffer = offerSelect.value;
    if (selectedOffer && selectedNetworkId) {
      populatePlans(selectedNetworkId, selectedOffer);
    }
  });

  const plans = networkPlans[offerName];
  if (!Array.isArray(plans)) {
    console.error(`No plans found for offer "${offerName}" in network ID ${networkId}`);
    const option = document.createElement('option');
    option.textContent = 'No plans available';
    planSelect.appendChild(option);
    return;
  }

  plans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.id;
    option.textContent = plan.label;
    planSelect.appendChild(option);
  });
}


  // Handle Buy button click
  payButton.addEventListener('click', (e) => {
    e.preventDefault();

    const phone = destinationInput.value.trim();

    if (!phone || !selectedNetworkId || !planSelect.value) {
      alert('Please fill in all fields and select a valid plan.');
      return;
    }

    selectedPlanId = planSelect.value;
    selectedPlanLabel = planSelect.options[planSelect.selectedIndex].text;

    const match = selectedPlanLabel.match(/\u20a6(\d+[.,]?\d*)/); // ₦ amount matcher
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
    window.location.href = 'dataconfirm.html?type=data';
  });
})();










