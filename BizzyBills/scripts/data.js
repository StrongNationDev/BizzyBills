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
      { id: 906, label: '230.0 MB - ₦250 (1Day) MTN SME' },
      { id: 903, label: '500 MB - ₦380 (1Day) MTN SME' },
      { id: 931, label: '1.0 GB - ₦480 (1-2 Day) MTN SME' },
      { id: 930, label: '1.5 GB - ₦640 (2-3Days) MTN SME' },
      { id: 691, label: '1.0 GB - ₦670 (1 Month) MTN SME' },
      { id: 617, label: '1.2 GB - ₦800 (7Days MTN Pulse Users) MTN SME'},
      { id: 663, label: '2.0 GB - ₦1300(1 Month) MTN SME'},
      { id: 716, label: '3.0 GB - ₦1950(1 Month) MTN SME'},
      { id: 717, label: '5.0 GB - ₦2470(1 Month) MTN SME'},
      { id: 908, label: '6.0 GB - ₦2660 (7 Days) MTN SME'},
      { id: 891, label: '11.0 GB - ₦3700 (7 Days) MTN SME'},
    ],
    "MTN GIFTING": [
      { id: 835, label: '75.0MB - ₦80 (1Days) MTN GIFTING' },
      { id: 837, label: '110.OMB - ₦110 (1Days) MTN GIFTING' },
      { id: 856, label: '230.OMB - ₦250 (1Days) MTN GIFTING' },
      { id: 845, label: '500.OMB - ₦380 (1Days) MTN GIFTING' },
      { id: 848, label: '1.0 MB - ₦530 (1-2Days) MTN GIFTING' },
      { id: 935, label: '1.2 MB - ₦495 (1 Month) (WhatsApp, F.B.& I.G)' },
      { id: 927, label: '500 MB - ₦510 (7 Days) MTN GIFTING' },
      { id: 928, label: '750 MB - ₦490 (3Days MTN Pulse Users) MTN GIFTING' },
      { id: 881, label: '1.5 GB - ₦640 (2-3Days) MTN GIFTING' },
      { id: 929, label: '1.2 GB - ₦790 (7Days MTN Pulse Users)' },
      { id: 850, label: '2.0 GB - ₦795 (2-3Days) MTN GIFTING' },
      { id: 834, label: '2.5 GB - ₦800 (1Days) MTN GIFTING' },
      { id: 870, label: '2.5 GB - ₦950 (2-3Days) MTN GIFTING' },
      { id: 833, label: '3.2 GB - ₦1080 (2-3Days) MTN GIFTING' },
      { id: 921, label: '1.0 GB - ₦950 (7 Days) MTN GIFTING' },
      { id: 838, label: '1.5 GB - ₦1150 (7 Days) MTN GIFTING' },
      { id: 866, label: '3.5 GB - ₦1570 (7 Days) MTN GIFTING' },
      { id: 841, label: '2.0 GB - ₦1580 (1 Month) MTN GIFTING' },
      { id: 843, label: '2.7 GB - ₦2120 (1 Month) MTN GIFTING' },
      { id: 842, label: '3.5 GB - ₦2570 (1 Month) MTN GIFTING' },
      { id: 849, label: '6.0 GB - ₦2600 (7Days) MTN GIFTING' },
      { id: 853, label: '7.0 GB - ₦3560 (1 Month) MTN GIFTING' },
      { id: 847, label: '11.0 GB - ₦3550 (7 Days) MTN GIFTING' },
      { id: 882, label: '10.0 GB - ₦4450 (1 Month) MTN GIFTING' },
      { id: 934, label: '12.0 GB - ₦4800 (1Month Wifi Only) MTN GIFTING' },
      { id: 871, label: '20.0 GB - ₦5200 (7Days) MTN GIFTING' },
      { id: 844, label: '12.5 GB - ₦5580 (1 Month) MTN GIFTING'},
      { id: 854, label: '16.5 GB - ₦6500 (1 Month) MTN GIFTING'},
      { id: 846, label: '20.0 GB - ₦7480 (1 Month) MTN GIFTING'},
      { id: 864, label: '25.0 GB - ₦9050 (1 Month) MTN GIFTING'},
      { id: 933, label: '30.0 GB - ₦9750 (1 Month Wifi Only) MTN GIFTING'},
      { id: 863, label: '36.0 GB - ₦10500 (1 Month) MTN GIFTING'},
      { id: 862, label: '75.0 GB - ₦17800 (1 Month) MTN GIFTING'},
      { id: 860, label: '90.0 GB - ₦25000 (2 Month) MTN GIFTING'},
      { id: 861, label: '150.0 GB - ₦40000 (2 Month) MTN GIFTING'},
      { id: 859, label: '200.0 GB - ₦49500 (2 Month) MTN GIFTING'},
    ]
  },
  2: { // GLO
    "GLO GIFTING": [
      { id: 539, label: '750 MB - ₦240 (1-2Days) GLO GIFTING' },
      { id: 421, label: '1.5 GB - ₦400 (1-2 Days) GLO GIFTING'},
      { id: 476, label: '2.5 GB - ₦570 (2-3Days) GLO GIFTING'},
      { id: 476, label: '10.0 GB - ₦2250 (7Days) GLO GIFTING'},
    ],
    "GLO CORPORATE GIFTING": [
      { id: 902, label: '200 MB - ₦150 (1 Month) GLO CORPORATE GIFTING'},
      { id: 221, label: '500.0 MB - ₦250 (1 Month) GLO CORPORATE GIFTING' },
      { id: 909, label: '500.0 MB - ₦380 (3 Days) GLO CORPORATE GIFTING' },
      { id: 912, label: '1.0 GB - ₦450 (1 Month) GLO CORPORATE GIFTING' },
      { id: 913, label: '2.0 GB - ₦870 (1 Month) GLO CORPORATE GIFTING' },
      { id: 910, label: '3.0 GB - ₦970 (3-4 Days) GLO CORPORATE GIFTING' },
      { id: 914, label: '3.0 GB - ₦1300 (1 Month) GLO CORPORATE GIFTING' },
      { id: 911, label: '5.0 GB - ₦1500 (3-4Days) GLO CORPORATE GIFTING' },
      { id: 916, label: '5.0 GB - ₦2280 (1 Month) GLO CORPORATE GIFTING' },
      { id: 915, label: '10.0 GB - ₦4300 (1 Month) GLO CORPORATE GIFTING' },
      { id: 915, label: '10.0 GB - ₦4300 (1 Month) GLO CORPORATE GIFTING' },
    ]
  },
  4: { // AIRTEL
    "AIRTEL GIFTING": [
      { id: 923, label: '150.0 MB - ₦90 (1Day Dont owe debt) AIRTEL GIFTING' },
      { id: 867, label: '100 MB - ₦150 (1Days) AIRTEL GIFTING' },
      { id: 925, label: '300  MB - ₦150 (1Days Dont owe debt) AIRTEL GIFTING'},
      { id: 868, label: '200 MB - ₦220 (1Days) AIRTEL GIFTING' },
      { id: 926, label: '600 MB - ₦300 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 869, label: '300 MB - ₦330 (1 Days) AIRTEL GIFTING' },
      { id: 722, label: '1.0 GB - ₦390 (1-2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 749, label: '1.5 GB - ₦500 (1-2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 889, label: '1.5 GB - ₦650 (2-3Days) AIRTEL GIFTING' },
      { id: 741, label: '2.0 GB - ₦700 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 763, label: '1.0 GB - ₦830 (7Days) AIRTEL GIFTING' },
      { id: 890, label: '2.0 GB - ₦790 (2Days) AIRTEL GIFTING' },
      { id: 748, label: '4.0 GB - ₦950 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 767, label: '1.5 GB - ₦1100 (7Days) AIRTEL GIFTING' },
      { id: 920, label: '3.2 GB - ₦1080 (2-3 Days) AIRTEL GIFTING'},
      { id: 918, label: '3.0 GB - ₦1080 (7Days Dont owe debt) AIRTEL GIFTING'},
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
payButton.addEventListener('click', async (e) => {
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

  // Get current user info
  const user = await getCurrentUser();
  if (!user) {
    alert('Unable to retrieve user information. Please login again.');
    window.location.href = 'login.html';
    return;
  }

  const walletBalance = user.wallet_balance || 0;
  const username = user.username || 'user';


  if (walletBalance < selectedPlanAmount) {
    const modal = document.getElementById('insufficientModal');
    const modalMessage = document.getElementById('modalMessage');

    modalMessage.textContent = `Hi @${username}, the amount of your selected plan is more than what you have in balance. Fund your account and try again.`;
    modal.style.display = 'block';
    return;
  }

  // Proceed to confirmation if balance is sufficient
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
