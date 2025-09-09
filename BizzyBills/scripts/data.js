import { getCurrentUser } from './user.js';

const networkRadios = document.querySelectorAll('#network_ids input');
const planSelect = document.querySelector('#plans select');
const destinationInput = document.getElementById('DestinationNumber');
const payButton = document.querySelector('.pay-button');
const offerSelect = document.getElementById('offerSelect');


const dataPlans = {
  1: { // MTN
    "MTN SME": [
      { id: 946, label: '1.0 GB - ₦540 (7 Day) MTN SME' },
      { id: 691, label: '1.0 GB - ₦560 (1 Month) MTN SME' },
      { id: 663, label: '2.0 GB - ₦1100 (1 Month) MTN SME' },
      { id: 716, label: '3.0 GB - ₦1745 (1 Month) MTN SME' },
      { id: 717, label: '5.0 GB - ₦2250 (1 Month) MTN SME' },
      { id: 891, label: '11.0 GB - ₦3535 (7Days) MTN SME' },
    ],
    "MTN CORPORATE GIFTING":[
      { id: 944, label: '1.0 GB - ₦680 (1 Month) MTN CORPORATE GIFTING' },
      { id: 960, label: '2.0 GB - ₦1230 (1 Month) MTN CORPORATE GIFTING' },
      { id: 959, label: '3.0 GB - ₦1880 (1 Month) MTN CORPORATE GIFTING' },
      { id: 957, label: '5.0 GB - ₦2350 (1 Month) MTN CORPORATE GIFTING' },
      { id: 958, label: '11.0 GB - ₦3520 (1 Month) MTN CORPORATE GIFTING' },
    ],
    "MTN GIFTING": [
      { id: 835, label: '75.0MB - ₦78 (1Days) MTN GIFTING' },
      { id: 837, label: '110.OMB - ₦98 (1Days) MTN GIFTING' },
      { id: 856, label: '230.OMB - ₦260 (1Days) MTN GIFTING' },
      { id: 845, label: '500.OMB - ₦348 (1Days) MTN GIFTING' },
      { id: 848, label: '1.0 MB - ₦500 (1-2Days) MTN GIFTING' },
      { id: 935, label: '1.2 MB - ₦500 (1 Month) (WhatsApp, F.B.& I.G)' },
      { id: 927, label: '500 MB - ₦530 (7 Days) MTN GIFTING' },
      { id: 928, label: '750 MB - ₦500 (3Days MTN Pulse Users) MTN GIFTING' },
      { id: 881, label: '1.5 GB - ₦650 (2-3Days) MTN GIFTING' },
      { id: 921, label: '1.0 GB - ₦810 (7Days MTN Pulse Users)' },
      { id: 929, label: '1.2 GB - ₦800 (7Days MTN Pulse Users)' },
      { id: 850, label: '2.0 GB - ₦800 (2-3Days) MTN GIFTING' },
      { id: 834, label: '2.5 GB - ₦775 (1Days) MTN GIFTING' },
      { id: 870, label: '2.5 GB - ₦915 (2-3Days) MTN GIFTING' },
      { id: 838, label: '1.5 GB - ₦1010 (7 Days) MTN GIFTING' },
      { id: 833, label: '3.2 GB - ₦1020 (2-3Days) MTN GIFTING' },
      { id: 866, label: '3.5 GB - ₦1515 (7 Days) MTN GIFTING' },
      { id: 841, label: '2.0 GB - ₦1525 (1 Month) MTN GIFTING' },
      { id: 843, label: '2.7 GB - ₦2030 (1 Month) MTN GIFTING' },
      { id: 842, label: '3.5 GB - ₦2510 (1 Month) MTN GIFTING' },
      { id: 849, label: '6.0 GB - ₦2510 (7Days) MTN GIFTING' },
      { id: 853, label: '7.0 GB - ₦3500 (1 Month) MTN GIFTING' },
      { id: 847, label: '11.0 GB - ₦3475 (7 Days) MTN GIFTING' },
      { id: 882, label: '10.0 GB - ₦4485 (1 Month) MTN GIFTING' },
      { id: 934, label: '12.0 GB - ₦4230 (1Month Wifi Only) MTN GIFTING' },
      { id: 871, label: '20.0 GB - ₦5030 (7Days) MTN GIFTING' },
      { id: 844, label: '12.5 GB - ₦5475 (1 Month) MTN GIFTING'},
      { id: 854, label: '16.5 GB - ₦6480 (1 Month) MTN GIFTING'},
      { id: 846, label: '20.0 GB - ₦7480 (1 Month) MTN GIFTING'},
      { id: 864, label: '25.0 GB - ₦8985 (1 Month) MTN GIFTING'},
      { id: 933, label: '30.0 GB - ₦9230 (1 Month Wifi Only) MTN GIFTING'},
      { id: 863, label: '36.0 GB - ₦9980 (1 Month) MTN GIFTING'},
      { id: 862, label: '75.0 GB - ₦17485 (1 Month) MTN GIFTING'},
      { id: 860, label: '90.0 GB - ₦24485 (2 Month) MTN GIFTING'},
      { id: 861, label: '150.0 GB - ₦38050 (2 Month) MTN GIFTING'},
      { id: 859, label: '200.0 GB - ₦48030 (2 Month) MTN GIFTING'},
    ]
  },
  2: { // GLO
    "GLO GIFTING": [
      { id: 539, label: '750 MB - ₦210 (1-2Days) GLO GIFTING' },
      { id: 421, label: '1.5 GB - ₦315 (1-2 Days) GLO GIFTING'},
      { id: 476, label: '2.5 GB - ₦495 (2-3Days) GLO GIFTING'},
      { id: 476, label: '10.0 GB - ₦2020 (7Days) GLO GIFTING'},
    ],
    "GLO CORPORATE GIFTING": [
      { id: 902, label: '200 MB - ₦110 (1 Month) GLO CORPORATE GIFTING'},
      { id: 221, label: '500.0 MB - ₦225 (1 Month) GLO CORPORATE GIFTING' },
      { id: 909, label: '1.0 GB - ₦380 (3 Days) GLO CORPORATE GIFTING' },
      { id: 912, label: '1.0 GB - ₦420 (1 Month) GLO CORPORATE GIFTING' },
      { id: 913, label: '2.0 GB - ₦835 (1 Month) GLO CORPORATE GIFTING' },
      { id: 910, label: '3.0 GB - ₦915 (3-4 Days) GLO CORPORATE GIFTING' },
      { id: 914, label: '3.0 GB - ₦1265 (1 Month) GLO CORPORATE GIFTING' },
      { id: 911, label: '5.0 GB - ₦1460 (3-4Days) GLO CORPORATE GIFTING' },
      { id: 916, label: '5.0 GB - ₦2120 (1 Month) GLO CORPORATE GIFTING' },
      { id: 915, label: '10.0 GB - ₦4230 (1 Month) GLO CORPORATE GIFTING' },
    ]
  },
  4: { // AIRTEL
    "AIRTEL GIFTING": [
      { id: 923, label: '150.0 MB - ₦85 (1Day Dont owe debt) AIRTEL GIFTING' },
      { id: 867, label: '100 MB - ₦110 (1Days) AIRTEL GIFTING' },
      { id: 925, label: '300  MB - ₦140 (1Days Dont owe debt) AIRTEL GIFTING'},
      { id: 868, label: '200 MB - ₦210 (1Days) AIRTEL GIFTING' },
      { id: 926, label: '600 MB - ₦290 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 869, label: '300 MB - ₦315 (1 Days) AIRTEL GIFTING' },
      { id: 749, label: '1.5 GB - ₦480 (1-2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 741, label: '2.0 GB - ₦675 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 763, label: '1.0 GB - ₦815 (7Days) AIRTEL GIFTING' },
      { id: 890, label: '2.0 GB - ₦780 (2Days) AIRTEL GIFTING' },
      { id: 748, label: '4.0 GB - ₦875 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 767, label: '1.5 GB - ₦1080 (7Days) AIRTEL GIFTING' },
      { id: 920, label: '3.2 GB - ₦1020 (2-3 Days) AIRTEL GIFTING'},
      { id: 809, label: '5.0 GB - ₦1515 (2-3Days) AIRTEL GIFTING'},
      { id: 829, label: '3.5 GB - ₦1520 (7 Days) AIRTEL GIFTING'},
      { id: 769, label: '3.0 GB - ₦2020 (1month) AIRTEL GIFTING'},
      { id: 757, label: '7.0 GB - ₦2120 (7Days Dont owe debt) AIRTEL GIFTING'},
      { id: 770, label: '4.0 GB - ₦2520 (1month) AIRTEL GIFTING'},
      { id: 771, label: '8.0 GB - ₦3015 (1month) AIRTEL GIFTING'},
      { id: 758, label: '10.0 GB - ₦3080 (7Days Dont owe debt) AIRTEL GIFTING'},
      { id: 773, label: '13.0 GB - ₦5015 (1month) AIRTEL GIFTING'},
      { id: 774, label: '18.0 GB - ₦6020 (1month) AIRTEL GIFTING'},
      { id: 775, label: '25.0 GB - ₦8030 (1month) AIRTEL GIFTING'},
      { id: 776, label: '35.0 GB - ₦9980 (1month) AIRTEL GIFTING'},
      { id: 777, label: '60.0 GB - ₦15025 (1month) AIRTEL GIFTING'},
    ],
    "AIRTEL CORPORATE GIFTING": [
      { id: 889, label: '1.5 GB - ₦640 (2 - 3 Days) AIRTEL CORPORATE GIFTING'},
      { id: 768, label: '2.0 GB - ₦1515 (1 Month) AIRTEL CORPORATE GIFTING'},
      { id: 961, label: '4.0 GB - ₦875 (2-3Days) AIRTEL CORPORATE GIFTING' },,
      { id: 809, label: '1.0 GB - ₦1625 (2-3Days) AIRTEL CORPORATE GIFTING' },
      { id: 772, label: '10.0 GB - ₦3125 (1 Month) AIRTEL CORPORATE GIFTING' },
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
