const providers = [
  { name: "IKEDC", icon: "icons/ikedc.png" },
  { name: "IBEDC", icon: "icons/ibedc.png" },
  { name: "EEDC", icon: "icons/eedc.png" },
];

let selectedProviderIdx = 0; 

const providerDropdown = document.getElementById('provider-dropdown');
const providerModal = document.getElementById('provider-list-modal');
const providerItems = document.getElementById('provider-items');
const searchBox = document.getElementById('provider-search');
const selectedProviderSpan = document.getElementById('selected-provider');
const closeBtn = document.getElementById('close-provider-list');

function renderProviders(filter = "") {
  providerItems.innerHTML = "";
  providers.forEach((provider, idx) => {
    if (
      filter &&
      !provider.name.toLowerCase().includes(filter.trim().toLowerCase())
    ) return;

    const li = document.createElement('li');
    li.dataset.idx = idx;

    li.innerHTML = `
      <div class="provider-info">
        <img src="${provider.icon}" alt="${provider.name}">
        <span class="provider-name">${provider.name}</span>
      </div>
      <span class="radio${selectedProviderIdx === idx ? " selected" : ""}"></span>
    `;
    li.onclick = () => selectProvider(idx);
    providerItems.appendChild(li);
  });
}
providerDropdown.onclick = () => {
  providerModal.style.display = "block";
  searchBox.value = "";
  renderProviders();
  setTimeout(() => searchBox.focus(), 100);
};

closeBtn.onclick = () => {
  providerModal.style.display = "none";
};

function selectProvider(idx) {
  selectedProviderIdx = idx;
  selectedProviderSpan.textContent = providers[idx].name;
  providerModal.style.display = "none";
}

searchBox.oninput = (e) => {
  renderProviders(e.target.value);
};

window.onload = () => {
  selectedProviderSpan.textContent = providers[selectedProviderIdx].name;
  renderProviders();
};