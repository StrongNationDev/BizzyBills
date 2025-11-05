import { getCurrentUser } from './user.js';

const networkRadios = document.querySelectorAll('#network_ids input');
const planSelect = document.querySelector('#plans select');
const destinationInput = document.getElementById('DestinationNumber');
const payButton = document.querySelector('.pay-button');
const offerSelect = document.getElementById('offerSelect');


const dataPlans = {
  1: { // MTN
    "MTN SME": [
      { id: 1026, label: '500 MB - ₦540 (1-2Days) MTN SME' },
      { id: 946, label: '1.0 GB - ₦540 (7Days) MTN SME' },
      { id: 691, label: '1.0 GB - ₦640 (1 Month) MTN SME' },
      { id: 1031, label: '1.5 GB - ₦645 (2-3Days) MTN SME' },
      { id: 1030, label: '2.0 GB - ₦790 (2 - 3 Days) MTN SME' },
      { id: 663, label: '2.0 GB - ₦1160 (1 Month) MTN SME' },
      { id: 717, label: '5.0 GB - ₦2300 (1 Month) MTN SME' },
      { id: 1025, label: '7.0 GB - ₦1940 (2-3 Days) MTN SME' },
      { id: 1028, label: '10.0 GB - ₦4570 (1 month) MTN SME' },
      { id: 1029, label: '11.0 GB - ₦3560 (7 Days) MTN SME' },
    ],
    "MTN CORPORATE GIFTING":[
      { id: 845, label: '500.0 MB - ₦375 (1-2 Days) MTN Corporate Gifting' },
      { id: 928, label: '750.0 MB - ₦500 (3-4 Days) MTN Corporate Gifting' },
      { id: 1024, label: '1.2 GB - ₦790 (7 Days) MTN Corporate Gifting' },
      { id: 850, label: '2.0 GB - ₦790 (2-3Days) MTN Corporate Gifting' },
      { id: 1019, label: '2.5 GB - ₦790 (1-2 Days) MTN Corporate Gifting' },
      { id: 881, label: '1.5 GB - ₦630 (2-3Days) MTN Corporate Gifting' },
      { id: 833, label: '3.2 GB - ₦1040 (2-3 Days) MTN Corporate Gifting' },
      { id: 870, label: '2.5 GB - ₦940 (2-3 Days) MTN Corporate Gifting' },
      { id: 1041, label: '1.5 GB - ₦1060 (7 Days) MTN Corporate Gifting' },
      { id: 962, label: '7.0 GB - ₦2000 (2-3 Days) MTN Corporate Gifting' },
      { id: 1018, label: '20.0 GB - ₦4975 (7 Days) MTN Corporate Gifting' },
      { id: 1021, label: '10.0 GB - ₦4490 at (30 Days) MTN Corporate Gifting' },
      { id: 958, label: '11.0 GB - ₦3600 (7 Days) MTN Corporate Gifting' },
    ],
    "MTN GIFTING": [
      { id: 835, label: '75.0 MB - ₦95 (1 Day) MTN Gifting' },
      { id: 992, label: '500.0 MB - ₦120 Night Plan (10Pm-6am) MTN Gifting' },
      { id: 837, label: '110.0 MB - ₦95 (1 Day) MTN Gifting' },
      { id: 856, label: '230.0 MB - ₦240 (1 Day) MTN Gifting' },
      { id: 935, label: '1.2 GB - ₦500 (1 Month Social Bundle )MTN Gifting' },
      { id: 927, label: '500.0 MB - ₦525 (7 Days) MTN Gifting' },
      { id: 842, label: '3.5 GB - ₦2555 (1 Month) MTN Gifting' },
      { id: 849, label: '6.0 GB - ₦2565 (7 Days) MTN Gifting' },
      { id: 853, label: '7.0 GB - ₦3555 (1 Month) MTN Gifting' },
      { id: 882, label: '10.0 MB - ₦4480 (1 Month) MTN Gifting' },
      { id: 834, label: '12.0 GB - ₦5100 (1 Month Wifi Only) MTN Gifting' },
      { id: 844, label: '12.5 GB - ₦5475 (1 Month) MTN Gifting' },
      { id: 871, label: '20.0 GB - ₦4980 (7 Day) MTN Gifting' },
      { id: 846, label: '20.0 GB - ₦7470 (1 Month) MTN Gifting' },
      { id: 854, label: '16.5 GB - ₦6450 (1 Month) MTN Gifting' },
      { id: 864, label: '25.0 GB - ₦8880 (1 Month) MTN Gifting' },
      { id: 933, label: '36.0 GB - ₦10800 (1 Month) MTN Gifting' },
      { id: 862, label: '75.0 GB - ₦17480 (1 Month) MTN Gifting' },
      { id: 860, label: '90.0 GB - ₦24150 (2 Month) MTN Gifting' },
      { id: 861, label: '150.0 GB - ₦38100 (2 Month) MTN Gifting' },
      { id: 859, label: '200.0 GB - ₦48700 (2 Month) MTN Gifting' },
      { id: 1016, label: '65.0 GB - ₦15920 (1 Month) MTN Gifting' },
      { id: 1043, label: '1.5 GB - ₦1040 (7 Days) MTN Gifting' },
    ]
  },
  2: { // GLO
    "GLO GIFTING": [
      { id: 995, label: '750 MB - ₦140 Night Plan (10Pm-6am) GLO Gifting' },
      { id: 998, label: '350 MB - ₦140 Night Plan (10Pm-6am) GLO Gifting' },
      { id: 539, label: '750 MB - ₦240 (1-2Day) GLO Gifting' },
      { id: 421, label: '1.5 GB - ₦345 (1-2Day) GLO Gifting' },
      { id: 912, label: '1.8 GB - ₦560 (14Days) GLO Gifting' },
      { id: 521, label: '2.5 GB - ₦540 (2-3Days) GLO Gifting' },
      { id: 1008, label: '1.8 GB - ₦555 (14Days) GLO Gifting' },
      { id: 910, label: '3.5 GB - ₦1085 (7 Days) GLO Gifting' },
      { id: 999, label: '3.5 GB - ₦650 (2-3 Days) GLO Gifting' },
      { id: 1010, label: '5.1 GB - ₦1090 (2-3 Days) GLO Gifting' },
      { id: 1005, label: '5.1 GB - ₦1060 (2-3 Days) GLO Gifting' },
      { id: 1004, label: '2.6 GB - ₦1050 (1 Month) GLO Gifting' },
      { id: 982, label: '5.0 GB - ₦1580 (1 Month) GLO Gifting' },
      { id: 1006, label: '6.0 GB - ₦1590 (7 Days) GLO Gifting' },
      { id: 981, label: '8.5 GB - ₦2080 (7Days) GLO Gifting' },
      { id: 476, label: '10.0 GB - ₦2090 (7Days) GLO Gifting' },
      { id: 994, label: '7.2 GB - ₦2575 (1Month) GLO Gifting' },
      { id: 987, label: '12.5 GB - ₦4060 (1Month) GLO Gifting' },
      { id: 988, label: '16.0 GB - ₦5080 (1Month) GLO Gifting' },
      { id: 983, label: '20.50 GB - ₦6095 (7Days) GLO Gifting' },
      { id: 989, label: '28.0 GB - ₦8070 (1Month) GLO Gifting' },
      { id: 990, label: '38.0 GB - ₦10150 (1Month) GLO Gifting' },
    ],
    "GLO CORPORATE GIFTING": [
      { id: 1040, label: '200.0 MB - ₦120 (2Weeks) GLO Corporate Gifting	' },
      { id: 1000, label: '500.0 MB - ₦265 (1Month) GLO Corporate Gifting	' },
      { id: 1015, label: '1.0 GB - ₦340 (3-4Days) GLO Corporate Gifting' },
      { id: 1036, label: '1.0 GB - ₦390 (7Days) GLO Corporate Gifting	' },
      { id: 1002, label: '1.0 GB - ₦450 (1Month) GLO Corporate Gifting' },
      { id: 1034, label: '2.5 GB - ₦540 (2-3Days) GLO Corporate Gifting' },
      { id: 1003, label: '2.0 GB - ₦570 (1-2 Days) GLO Corporate Gifting' },
      { id: 1007, label: '2.0 GB - ₦885 (1 Month) GLO Corporate Gifting' },
      { id: 1012, label: '3.0 GB - ₦880 (3-4DAYS) GLO Corporate Gifting' },
      { id: 1039, label: '3.0 GB - ₦1360 (1Month) GLO Corporate Gifting' },
      { id: 1013, label: '5.0 GB - ₦1490 (3-4DAYS) GLO Corporate Gifting' },
      { id: 1035, label: '10.0 GB - ₦2090 (7Days) GLO Corporate Gifting' },
      { id: 1038, label: '5.0 GB - ₦2250 (1Month) GLO Corporate Gifting' },
      { id: 986, label: '10.0 GB - ₦3080 (1Month) GLO Corporate Gifting' },
    ]
  },

  4: { // AIRTEL
    "AIRTEL GIFTING": [
      { id: 923, label: '150.0MB - ₦95 (1Day Dont owe debt) AIRTEL GIFTING' },
      { id: 925, label: '300.0MB - 175 (1Day Dont owe debt) AIRTEL GIFTING' },
      { id: 926, label: '600.0MB - ₦310 (2Day Dont owe debt) AIRTEL GIFTING' },
      { id: 749, label: '1.5 GB - ₦490 (1-2Day Dont owe debt) AIRTEL GIFTING' },
      { id: 965, label: '3.0 GB - ₦890 (2-3Days Dont owe debt) AIRTEL GIFTING' },
      { id: 748, label: '4.0 GB - ₦890 (2-3Days Dont owe debt) AIRTEL GIFTING' },
      { id: 757, label: '7.0 GB - ₦2060 (7Days Dont owe debt) AIRTEL GIFTING' },
      { id: 758, label: '10.0 GB - ₦3180 (1Month Dont owe debt) AIRTEL GIFTING' },
      { id: 966, label: '13.0 GB - ₦5570 (1Month Dont owe debt) AIRTEL GIFTING' },
      { id: 1014, label: '10.0 GB - ₦13060 (7Days) AIRTEL GIFTING' },
      { id: 967, label: '35.0 GB - ₦10200 (1Month Dont owe debt) AIRTEL GIFTING' },
      { id: 1044, label: '5.0 GB - ₦1570 (7Days Dont owe debt) AIRTEL GIFTING' },
    ],
    "AIRTEL CORPORATE GIFTING": [
      { id: 867, label: '100.0 MB - ₦110 (2-3 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 869, label: '300.0 MB - ₦320 (2-3 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 964, label: '1.5 GB - ₦530 (1-2 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 889, label: '2.0 GB - ₦690 (2-3 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 763, label: '1.0 GB - ₦835 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 961, label: '4.0 GB - ₦890 (2-3 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 767, label: '1.5 GB - ₦1000 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 920, label: '3.2 GB - ₦1050 (2-3 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 829, label: '3.5 GB - ₦1560 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 809, label: '5.0 GB - ₦1570 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 768, label: '2.0 GB - ₦1550 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 769, label: '3.0 GB - ₦2060 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 1033, label: '7.0 GB - ₦2070 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 770, label: '4.0 GB - ₦2540 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 969, label: '6.0 GB - ₦2550 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 968, label: '10.0 GB - ₦3080 (7 Days) AIRTEL CORPORATE GIFTING ' },
      { id: 772, label: '10.0 GB - ₦4070 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 773, label: '13.0 GB - ₦5070 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 774, label: '18.0 GB - ₦5980 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 775, label: '25.0 GB - ₦7970 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 776, label: '35.0 GB - ₦9975 (1 Month) AIRTEL CORPORATE GIFTING ' },
      { id: 777, label: '60.0 GB - ₦14750 (7 Days) AIRTEL CORPORATE GIFTING ' },
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