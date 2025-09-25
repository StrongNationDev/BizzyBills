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
      { id: 663, label: '2.0 GB - ₦1090 (1 Month) MTN SME' },
      { id: 716, label: '3.0 GB - ₦1645 (1 Month) MTN SME' },
      { id: 717, label: '5.0 GB - ₦2240 (1 Month) MTN SME' },
      { id: 891, label: '11.0 GB - ₦3550 (7Days) MTN SME' },
    ],
    "MTN CORPORATE GIFTING":[
      { id: 944, label: '1.0 GB - ₦630 (1 Month) MTN CORPORATE GIFTING' },
      { id: 960, label: '2.0 GB - ₦1240 (1 Month) MTN CORPORATE GIFTING' },
      { id: 959, label: '3.0 GB - ₦1650 (30 Days) MTN CORPORATE GIFTING' },
      { id: 957, label: '5.0 GB - ₦2340 (30 Days) MTN CORPORATE GIFTING' },
      { id: 958, label: '11.0 GB - ₦3550 (30 Days) MTN CORPORATE GIFTING' },
    ],
    "MTN GIFTING": [
      { id: 835, label: '75.0MB - ₦90 (1Days) MTN GIFTING' },
      { id: 992, label: '500.0MB - ₦135 Night Plan (10Pm - 6am)' },
      { id: 837, label: '110.0MB - ₦108 (1Days) MTN GIFTING' },
      { id: 856, label: '230.0MB - ₦240 (1Days) MTN GIFTING' },
      { id: 845, label: '500.0MB - ₦385 (1-2Days) MTN GIFTING' },
      { id: 935, label: '1.2 GB - ₦500 (1Month) Social Bundle' },
      { id: 848, label: '1.0 GB - ₦530 (1-2Days) MTN GIFTING' },
      { id: 927, label: '500.0MB - ₦530 (7 Days) MTN GIFTING' },
      { id: 928, label: '750.0MB - ₦480 (3Days MTN Pulse Users) MTN GIFTING' },
      { id: 881, label: '1.5 GB - ₦625 (2-3Days) MTN GIFTING' },
      { id: 921, label: '1.0 GB - ₦780 (7Days MTN Pulse Users)' },
      { id: 929, label: '1.2 GB - ₦829 (7Days MTN Pulse Users)' },
      { id: 850, label: '2.0 GB - ₦780 (2-3Days) MTN GIFTING' },
      { id: 834, label: '2.5 GB - ₦765 (1Days) MTN GIFTING' },
      { id: 870, label: '2.5 GB - ₦930 (2-3Days) MTN GIFTING' },
      { id: 838, label: '1.5 GB - ₦1030 (7 Days) MTN GIFTING' },
      { id: 833, label: '3.2 GB - ₦1035 (2-3Days) MTN GIFTING' },
      { id: 866, label: '3.5 GB - ₦1580 (7 Days) MTN GIFTING' },
      { id: 841, label: '2.0 GB - ₦1535 (1 Month) MTN GIFTING' },
      { id: 843, label: '2.7 GB - ₦2040 (1 Month) MTN GIFTING' },
      { id: 962, label: '7.0 GB - ₦1960(2-3Days) MTN GIFTING' },
      { id: 842, label: '3.5 GB - ₦2530 (1 Month) MTN GIFTING' },
      { id: 849, label: '6.0 GB - ₦2525 (7Days) MTN GIFTING' },
      { id: 882, label: '10.0 GB - ₦4490 (1 Month) MTN GIFTING' },
      { id: 847, label: '11.0 GB - ₦3480 (7 Days) MTN GIFTING' },
      { id: 853, label: '7.0 GB - ₦3498 (1 Month) MTN GIFTING' },
      { id: 934, label: '12.0 GB - ₦4300 (1Month Wifi Only) MTN GIFTING' },
      { id: 871, label: '20.0 GB - ₦5080 (7Days) MTN GIFTING' },
      { id: 844, label: '12.5 GB - ₦5485 (1 Month) MTN GIFTING'},
      { id: 854, label: '16.5 GB - ₦6490 (1 Month) MTN GIFTING'},
      { id: 846, label: '20.0 GB - ₦7480 (1 Month) MTN GIFTING'},
      { id: 864, label: '25.0 GB - ₦8985 (1 Month) MTN GIFTING'},
      { id: 933, label: '30.0 GB - ₦9250 (1 Month Wifi Only) MTN GIFTING'},
      { id: 863, label: '36.0 GB - ₦9980 (1 Month) MTN GIFTING'},
      { id: 862, label: '75.0 GB - ₦17500 (1 Month) MTN GIFTING'},
      { id: 860, label: '90.0 GB - ₦24100 (2 Month) MTN GIFTING'},
      { id: 861, label: '150.0 GB - ₦38100 (2 Month) MTN GIFTING'},
      { id: 859, label: '200.0 GB - ₦48150 (2 Month) MTN GIFTING'},
    ]
  },
  2: { // GLO
    "GLO GIFTING": [
      { id: 998, label: '750 MB - ₦80 NIGHT PLAN (10PM - 6AM)NIGHT PLAN (10PM - 6AM) GLO GIFTING' },
      { id: 995, label: '750 MB - ₦140 NIGHT PLAN (10PM - 6AM) GLO GIFTING' },
      { id: 539, label: '750.0 MB - ₦240 (1-2DAYS) GLO GIFTING'},
      { id: 421, label: '1.5 GB - ₦345 (1-2 Dayss) GLO GIFTING'},
      { id: 870, label: '2.5 GB - ₦540 (2-3Days) GLO GIFTING'},
      { id: 985, label: '3.5 GB - ₦690 (3 DAYS) GLO GIFTING'},
      { id: 476, label: '10.0 GB - ₦2050 (7Days) GLO GIFTING'},
    ],
    "GLO CORPORATE GIFTING": [
      { id: 1000, label: '105 MB - ₦110 (1-2Days) GLO CORPORATE GIFTING'},
      { id: 1001, label: '235.0 MB - ₦225 (1-2Days) GLO CORPORATE GIFTING'},
      { id: 1002, label: '1.0 GB - ₦390 (1-2 Days) GLO CORPORATE GIFTING'},
      { id: 912, label: '1.8 GB - ₦590 (7 DAYS) GLO CORPORATE GIFTING' },
      { id: 985, label: '3.5 GB - ₦650 (1-2 DAYS) GLO CORPORATE GIFTING' },
      { id: 1004, label: '2.6 GB - ₦1100 (1 Month) GLO CORPORATE GIFTING' },
      { id: 1005, label: '5.0 GB - ₦1100 (3-5 DAYS) GLO CORPORATE GIFTING' },
      { id: 910, label: '3.0 GB - ₦1050 (7 Days) GLO CORPORATE GIFTING' },
      { id: 982, label: '5.0 GB - ₦1550 (1 Month) +3GB NIGHT GLO CORPORATE GIFTING' },
      { id: 1006, label: '6.0 GB - ₦1600 (7 Days) GLO CORPORATE GIFTING' },
      { id: 981, label: '8.5 GB - ₦2030 (7 Days) GLO CORPORATE GIFTING' },
      { id: 994, label: '7.2 GB - ₦2540 (1 Month) GLO CORPORATE GIFTING' },
      { id: 986, label: '10.0 GB - ₦3050 (1 Month) GLO CORPORATE GIFTING' },
      { id: 987, label: '12.5 GB - ₦4050 (1 Month) GLO CORPORATE GIFTING' },
      { id: 988, label: '16.0 GB - ₦5040 (1 Month) GLO CORPORATE GIFTING' },
      { id: 983, label: '20.5 GB - ₦6090 (7 DAYS +18GB NIGHT) GLO CORPORATE GIFTING' },
      { id: 989, label: '28.0 GB - ₦8050 (1 Month) GLO CORPORATE GIFTING' },
      { id: 990, label: '38.0 GB - ₦10100 (1 Month) GLO CORPORATE GIFTING' },
    ]
  },
  4: { // AIRTEL
    "AIRTEL GIFTING": [
      { id: 923, label: '150.0 MB - ₦95 (1Day Dont owe debt) AIRTEL GIFTING' },
      { id: 925, label: '300  MB - ₦175 (1Days Dont owe debt) AIRTEL GIFTING'},
      { id: 926, label: '600 MB - ₦295 (2Days Dont owe debt) AIRTEL GIFTING' },
      { id: 758, label: '10.0 GB - ₦3150 (7Days Dont owe debt) AIRTEL GIFTING'},
      { id: 749, label: '1.5 GB - ₦475 (1-2Day Dont owe debt) AIRTEL GIFTING'},
      { id: 741, label: '2.0 GB - ₦690 (3 Days) AIRTEL GIFTING'},
      { id: 728, label: '3.0 GB - ₦880 (3 Days) AIRTEL GIFTING'},
      { id: 757, label: '7.0 GB - ₦2040 (3 Days) AIRTEL GIFTING'},

      
      // { id: 890, label: '2.0 GB - ₦780 (2Days) AIRTEL GIFTING' },
      
      // { id: 767, label: '1.5 GB - ₦1035 (7Days) AIRTEL GIFTING' },

      // { id: 757, label: '7.0 GB - ₦2120 (7Days Dont owe debt) AIRTEL GIFTING'},
      
    ],
    "AIRTEL CORPORATE GIFTING": [
      // { id: 867, label: '100 MB - ₦120 (1Days) AIRTEL GIFTING' },
      // { id: 868, label: '200 MB - ₦230 (1Days) AIRTEL GIFTING' },
      // { id: 869, label: '300 MB - ₦325 (1 Days) AIRTEL GIFTING' },
      // { id: 749, label: '1.5 GB - ₦530 (1-2Days Dont owe debt) AIRTEL GIFTING' },
      // { id: 741, label: '2.0 GB - ₦680 (2Days Dont owe debt) AIRTEL GIFTING' },
      // { id: 763, label: '1.0 GB - ₦820 (7Days) AIRTEL GIFTING' },
      // { id: 767, label: '1.5 GB - ₦1035 (7Days) AIRTEL GIFTING' },
      // { id: 920, label: '3.2 GB - ₦1035 (2-3 Days) AIRTEL GIFTING'},
      // { id: 829, label: '3.5 GB - ₦1530 (7 Days) AIRTEL GIFTING'},
      // { id: 809, label: '5.0 GB - ₦1535 (2-3Days) AIRTEL GIFTING'},
      // { id: 769, label: '3.0 GB - ₦2040 (1month) AIRTEL GIFTING'},
      // { id: 770, label: '4.0 GB - ₦2540 (1month) AIRTEL GIFTING'},
      // { id: 771, label: '8.0 GB - ₦3050 (1month) AIRTEL GIFTING'},
      

      // { id: 889, label: '1.5 GB - ₦640 (2 - 3 Days) AIRTEL CORPORATE GIFTING'},
      { id: 768, label: '2.0 GB - ₦1535 (1 Month) AIRTEL CORPORATE GIFTING'},
      { id: 961, label: '4.0 GB - ₦875 (2-3Days) AIRTEL CORPORATE GIFTING' },,
      // { id: 809, label: '1.0 GB - ₦1625 (2-3Days) AIRTEL CORPORATE GIFTING' },
      { id: 772, label: '10.0 GB - ₦4035 (1 Month) AIRTEL CORPORATE GIFTING' },
      { id: 774, label: '18.0 GB - ₦5950 (1month) AIRTEL GIFTING'},
      { id: 775, label: '25.0 GB - ₦7950 (1month) AIRTEL GIFTING'},
      { id: 777, label: '60.0 GB - ₦14780 (1month) AIRTEL GIFTING'},
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
