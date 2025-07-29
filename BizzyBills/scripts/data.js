import { getCurrentUser } from './user.js';

const networkRadios = document.querySelectorAll('#network_ids input');
const planSelect = document.querySelector('#plans select');
const destinationInput = document.getElementById('DestinationNumber');
const payButton = document.querySelector('.pay-button');

// Plan database by network ID
const dataPlans = {
  1: [ // MTN
    { id: 907, label: '150.0 MB - ₦110 (1Day) MTN SME' },
    { id: 854, label: '16.5 GB - ₦6500 (1Month) MTN GIFTING' },
    { id: 921, label: '1.0 GB - ₦1096 (7days) MTN GIFTING' },
    { id: 856, label: '230.0 MB - ₦250 (1Day) MTN GIFTING' },
    { id: 837, label: '110.0 MB - ₦110 (1Day) MTN GIFTING' },
    { id: 716, label: '3.0 GB - ₦2000 (1Month) MTN SME' },
    { id: 870, label: '2.5 GB - ₦965 (2-3Days) MTN GIFTING' },
    { id: 871, label: '20.0 GB - ₦5100 (7DAYS) MTN GIFTING' },
    { id: 866, label: '3.5 GB - ₦1600 (7Days) MTN GIFTING' },
    { id: 845, label: '500.0 MB - ₦395 (1Day) MTN GIFTING' },
    { id: 846, label: '20.0 GB - ₦7600 (1Month) MTN GIFTING' },
    { id: 929, label: '1.2 GB - ₦800 (7Days MTN Pulse Users) MTN GIFTING' },
    { id: 903, label: '500.0 MB - ₦395 (1Day) MTN SME' },
    { id: 859, label: '200.0 GB - ₦49000 (2Month) MTN GIFTING' },
    { id: 838, label: '1.5 GB - ₦1100 (7Days) MTN GIFTING' },
    { id: 835, label: '75.0 MB - ₦80 (1Day) MTN GIFTING' },
    { id: 833, label: '3.2 GB - ₦1095 (2-3Days) MTN GIFTING' },
    { id: 906, label: '230.0 MB - ₦250 (1Day) MTN SME' },
    { id: 848, label: '1.0 GB - ₦480 (1-2Days) MTN GIFTING' },
    { id: 882, label: '10.0 GB - ₦4800 (1Month) MTN GIFTING' },
    { id: 881, label: '1.5 GB - ₦650 (2-3Days) MTN GIFTING' },
    { id: 927, label: '500.0 MB - ₦500 (7Days) MTN GIFTING' },
    { id: 928, label: '750.0 MB - ₦500 (3Days MTN Pulse Users) MTN GIFTING' },
    { id: 663, label: '2.0 GB - ₦1350 (1Month) MTN SME' },
    { id: 844, label: '12.5 GB - ₦5600 (1Month) MTN GIFTING' },
    { id: 853, label: '7.0 GB - ₦3600 (1Month) MTN GIFTING' },
    { id: 862, label: '75.0 GB - ₦17900 (1Month) MTN GIFTING' },
    { id: 847, label: '11.0 GB - ₦3600 (7Days) MTN GIFTING' },
    { id: 850, label: '2.0 GB - ₦800 (2-3Days) MTN GIFTING' },
    { id: 849, label: '6.0 GB - ₦2650 (7Days) MTN GIFTING' },
    { id: 842, label: '3.5 GB - ₦2600 (1Month) MTN GIFTING' },
    { id: 843, label: '2.7 GB - ₦2100 (1Month) MTN GIFTING' },
    { id: 717, label: '5.0 GB - ₦2500 (1month) MTN SME' },
    { id: 691, label: '1.0 GB - ₦695 (1Month) MTN SME' },
    { id: 834, label: '2.5 GB - ₦800 (1Day) MTN GIFTING' },
    { id: 841, label: '2.0 GB - ₦1600 (1Month) MTN GIFTING' },
    { id: 917, label: '1.2 GB - ₦795 (7Days MTN Pulse Users) MTN SME' },
    { id: 860, label: '90.0 GB - ₦25500 (2Month) MTN GIFTING' },
    { id: 861, label: '150.0 GB - ₦39000 (2Month) MTN GIFTING' },
    { id: 891, label: '11.0 GB - ₦3700 (7Days) MTN SME' },
    { id: 863, label: '36.0 GB - ₦11500 (1Month) MTN GIFTING' },
    { id: 864, label: '25.0 GB - ₦9000 (1Month) MTN GIFTING' },
    { id: 908, label: '6.0 GB - ₦2650 (7Days) MTN SME' },
  ],
  2: [ // GLO
    { id: 910, label: '3.0 GB - ₦1000 (3Days) GLO CORPORATE GIFTING' },
    { id: 221, label: '500.0 MB - ₦250 (1 Month) GLO CORPORATE GIFTING' },
    { id: 421, label: '1.5 GB - ₦450 (1-2Days) GLO GIFTING' },
    { id: 521, label: '2.5 GB - ₦600 (2DAYS) GLO GIFTING' },
    { id: 476, label: '10.0 GB - ₦2300 (7DAYS) GLO GIFTING' },
    { id: 539, label: '750.0 MB - ₦245 (1Day) GLO GIFTING' },
    { id: 912, label: '1.0 GB - ₦500 (1Month) GLO CORPORATE GIFTING' },
    { id: 902, label: '200.0 MB - ₦150 (1Month) GLO CORPORATE GIFTING' },
    { id: 911, label: '5.0 GB - ₦1700 (3Days) GLO CORPORATE GIFTING' },
    { id: 913, label: '2.0 GB - ₦900 (1Month) GLO CORPORATE GIFTING' },
    { id: 914, label: '3.0 GB - ₦1500 (1Month) GLO CORPORATE GIFTING' },
    { id: 915, label: '10.0 GB - ₦4800 (1Month) GLO CORPORATE GIFTING' },
    { id: 916, label: '5.0 GB - ₦2500 (1Month) GLO CORPORATE GIFTING' },
    { id: 909, label: '1.0 GB - ₦400 (3Days) GLO CORPORATE GIFTING' },

  ],
  4: [ // AIRTEL
    { id: 868, label: '200.0 MB - ₦200 (1Day) AIRTEL GIFTING' },
    { id: 767, label: '1.5 GB - ₦1100 (7Days) AIRTEL GIFTING' },
    { id: 920, label: '3.0 GB - ₦1100 (2DAYS) AIRTEL GIFTING' },
    { id: 918, label: '3.0 GB - ₦1200 (7Days Dont owe debt) AIRTEL GIFTING' },
    { id: 919, label: '10.0 GB - ₦4000 (1Month) AIRTEL GIFTING' },
    { id: 777, label: '60.0 GB - ₦16000 (1month) AIRTEL GIFTING' },
    { id: 867, label: '100.0 MB - ₦150 (1Day) AIRTEL GIFTING' },
    { id: 769, label: '3.0 GB - ₦2100 (1month) AIRTEL GIFTING' },
    { id: 770, label: '4.0 GB - ₦2500 (1month) AIRTEL GIFTING' },
    { id: 923, label: '150.0 MB - ₦80 (1Day Dont owe debt) AIRTEL GIFTING' },
    { id: 889, label: '1.5 GB - ₦700 (2DAYS) AIRTEL GIFTING' },
    { id: 771, label: '8.0 GB - ₦3200 (1month) AIRTEL GIFTING' },
    { id: 926, label: '600.0 MB - ₦300 (2Day Dont owe debt) AIRTEL GIFTING' },
    { id: 925, label: '300.0 MB - ₦150 (1Day Dont owe debt) AIRTEL GIFTING' },
    { id: 890, label: '2.0 GB - ₦800 (2Days) AIRTEL GIFTING' },
    { id: 722, label: '1.0 GB - ₦400 (1Day Dont owe debt) AIRTEL GIFTING' },
    { id: 829, label: '3.5 GB - ₦1600 (7Days) AIRTEL GIFTING' },
    { id: 773, label: '13.0 GB - ₦5200 (1month) AIRTEL GIFTING' },
    { id: 774, label: '18.0 GB - ₦6500 (1month) AIRTEL GIFTING' },
    { id: 775, label: '25.0 GB - ₦8500 (1month) AIRTEL GIFTING' },
    { id: 869, label: '300.0 MB - ₦300 (1Day) AIRTEL GIFTING' },
    { id: 772, label: '10.0 GB - ₦4200 (1month) AIRTEL GIFTING' },
    { id: 768, label: '2.0 GB - ₦1500 (1month) AIRTEL GIFTING' },
    { id: 741, label: '2.0 GB - ₦700 (2Days Dont owe debt) AIRTEL GIFTING' },
    { id: 757, label: '7.0 GB - ₦2350 (7Days Dont owe debt) AIRTEL GIFTING' },
    { id: 758, label: '10.0 GB - ₦3500 (7Days Dont owe debt) AIRTEL GIFTING' },
    { id: 809, label: '5.0 GB - ₦1500 (2-3Days) AIRTEL GIFTING' },
    { id: 763, label: '1.0 GB - ₦795 (7days) AIRTEL GIFTING' },
    { id: 748, label: '4.0 GB - ₦1000 (2Days Dont owe debt) AIRTEL GIFTING' },
    { id: 749, label: '1.5 GB - ₦500 (1Day Dont owe debt) AIRTEL GIFTING' },
    { id: 776, label: '35.0 GB - ₦11000 (1month) AIRTEL GIFTING' },

  ]
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
      // Reset label background
      networkRadios.forEach(r => r.closest('label').style.backgroundColor = '');
      label.style.backgroundColor = 'black';

      selectedNetworkName = img.alt;
      selectedNetworkIcon = img.src;

      // Set network ID mapping
      switch (selectedNetworkName.toUpperCase()) {
        case 'MTN': selectedNetworkId = 1; break;
        case 'GLO': selectedNetworkId = 2; break;
        case 'AIRTEL': selectedNetworkId = 4; break;
        default: selectedNetworkId = null;
      }

      populatePlans(selectedNetworkId);
    });
  });

  // Populate plan options
  function populatePlans(networkId) {
    planSelect.innerHTML = '';

    const plans = dataPlans[networkId];
    if (!plans || plans.length === 0) {
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






























// import { getCurrentUser } from './user.js';

// const networkRadios = document.querySelectorAll('#network_ids input');
// const planSelect = document.querySelector('#plans select');
// const destinationInput = document.getElementById('DestinationNumber');
// const payButton = document.querySelector('.pay-button');

// let selectedNetworkId = null;
// let selectedNetworkName = null;
// let selectedNetworkIcon = null;
// let selectedPlanId = null;
// let selectedPlanAmount = null;
// let selectedPlanLabel = null;

// (async () => {
//   const user = await getCurrentUser();
//   if (!user) {
//     alert('Please login first.');
//     window.location.href = 'login.html';
//     return;
//   }

//   // Network Selection with style
//   networkRadios.forEach((radio, index) => {
//     const label = radio.closest('label');
//     const img = label.querySelector('img');

//     radio.addEventListener('change', () => {
//       networkRadios.forEach(r => r.closest('label').style.backgroundColor = '');
//       label.style.backgroundColor = 'black';

//       selectedNetworkName = img.alt;
//       selectedNetworkIcon = img.src;
//       selectedNetworkId = img.alt === 'MTN' ? 1 : img.alt === 'Glo' ? 2 : 4; // Airtel = 4

//       populatePlans(selectedNetworkId);
//     });
//   });

//   function populatePlans(networkId) {
//     const plans = {
//       1: [ // MTN
//         { id: 230, label: '3.5GB - ₦2407 (30 days)' },
//         { id: 50, label: '2.0GB - ₦1448 (30 days)' },
//         { id: 51, label: '1.5GB - ₦964 (7 days)' },
//         { id: 394, label: '500MB - ₦485 (7 days)' },
//       ],
//       2: [ // GLO
//         { id: 27, label: '12.5GB - ₦3720 (30 days)' },
//         { id: 28, label: '10GB - ₦2790 (30 days)' },
//         { id: 29, label: '7.5GB - ₦2325 (30 days)' },
//       ],
//       4: [ // AIRTEL
//         { id: 453, label: '3GB - ₦1000 (2 days)' },
//         { id: 454, label: '75MB - ₦75 (1 day)' },
//         { id: 455, label: '10GB - ₦3000 (7 days)' },
//       ]
//     };

//     planSelect.innerHTML = '';
//     plans[networkId].forEach(plan => {
//       const option = document.createElement('option');
//       option.value = plan.id;
//       option.textContent = plan.label;
//       planSelect.appendChild(option);
//     });
//   }

//   payButton.addEventListener('click', e => {
//     e.preventDefault();

//     const phone = destinationInput.value.trim();
//     if (!phone || !selectedNetworkId) return alert('Fill all fields.');

//     selectedPlanId = planSelect.value;
//     selectedPlanLabel = planSelect.options[planSelect.selectedIndex].text;
//     const match = selectedPlanLabel.match(/\u20a6(\d+[.,]?\d*)/);
//     selectedPlanAmount = match ? parseFloat(match[1].replace(',', '')) : 0;

//     const payload = {
//       type: 'data',
//       phone,
//       amount: selectedPlanAmount,
//       network: selectedNetworkName,
//       network_id: selectedNetworkId,
//       network_icon: selectedNetworkIcon,
//       plan_id: parseInt(selectedPlanId),
//       plan_label: selectedPlanLabel
//     };

//     localStorage.setItem('pendingTransaction', JSON.stringify(payload));
//     window.location.href = 'dataconfirm.html?type=data';
//   });
// })();
