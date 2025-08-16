// electricity.js
import { getCurrentUser } from './user.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Check if user is logged in
  const user = await getCurrentUser();
  if (!user) {
    alert('You must be logged in to use this service.');
    window.location.href = 'login.html';
    return;
  }

  // Elements
  const selectedProviderEl = document.getElementById('selected-provider');
  const providerListModal = document.getElementById('provider-list-modal');
  const closeProviderListBtn = document.getElementById('close-provider-list');
  const providerItems = document.getElementById('provider-items');
  const providerSearch = document.getElementById('provider-search');
  const amountInput = document.getElementById('AmountToPay');
  const continueBtn = document.getElementById('continuetopay');

  // Step 2: List of Disco providers
  const discoList = [
    { id: 1, name: 'Ikeja Electric' },
    { id: 2, name: 'Eko Electric' },
    { id: 3, name: 'Abuja Electric' },
    { id: 4, name: 'Kano Electric' },
    { id: 5, name: 'Enugu Electric' },
    { id: 6, name: 'Port Harcourt Electric' },
    { id: 7, name: 'Ibadan Electric' },
    { id: 8, name: 'Kaduna Electric' },
    { id: 9, name: 'Jos Electric' },
    { id: 10, name: 'Benin Electric' },
    { id: 11, name: 'Yola Electric' },
  ];

  let selectedProvider = null;

  // Step 3: Show modal on click
  selectedProviderEl.addEventListener('click', () => {
    providerListModal.style.display = 'block';
    renderProviderList(discoList);
  });

  // Step 4: Close modal
  closeProviderListBtn.addEventListener('click', () => {
    providerListModal.style.display = 'none';
  });

  // Step 5: Search filter
  providerSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = discoList.filter(d =>
      d.name.toLowerCase().includes(searchTerm)
    );
    renderProviderList(filtered);
  });

  // Step 6: Render providers
  function renderProviderList(list) {
    providerItems.innerHTML = '';
    list.forEach(provider => {
      const li = document.createElement('li');
      li.textContent = provider.name;
      li.dataset.id = provider.id; // hidden ID
      li.addEventListener('click', () => {
        selectedProvider = provider;
        selectedProviderEl.textContent = provider.name;
        providerListModal.style.display = 'none';
      });
      providerItems.appendChild(li);
    });
  }

  // Step 7: Continue button
  continueBtn.addEventListener('click', () => {
    if (!selectedProvider) {
      alert('Please select a provider.');
      return;
    }
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount < 1000) {
      alert('Please enter a valid amount (minimum 1000).');
      return;
    }

    // Save details to localStorage for electconfirm.html
    localStorage.setItem('electricityOrder', JSON.stringify({
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      amount: amount
    }));

    // Redirect to confirmation page
    window.location.href = 'electconfirm.html';
  });
});
